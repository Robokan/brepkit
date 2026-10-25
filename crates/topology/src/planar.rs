//! A planar face's boundary flattened into its plane.

use brepkit_math::nurbs::curve::NurbsCurve;
use brepkit_math::quadrature;
use brepkit_math::region2d::Boundary2;
use brepkit_math::vec::{Point2, Point3, Vec2, Vec3};

use crate::Topology;
use crate::TopologyError;
use crate::edge::EdgeCurve;
use crate::face::FaceId;
use crate::wire::{OrientedEdge, WireId};

/// A planar face's boundary flattened into its plane, holes included.
///
/// The plane runs through `origin`, spanned by the orthonormal `x` and `y`.
/// A line becomes a segment, a circle or ellipse arc the arc it is. `None`
/// when an edge is a NURBS curve.
///
/// # Errors
///
/// Returns [`TopologyError`] if an entity lookup fails.
pub fn face_boundary_2d(
    topo: &Topology,
    face: FaceId,
    origin: Point3,
    x: Vec3,
    y: Vec3,
) -> Result<Option<Vec<Boundary2>>, TopologyError> {
    let face = topo.face(face)?;
    let flat = |p: Point3| {
        let d = p - origin;
        Point2::new(d.dot(x), d.dot(y))
    };
    let along = |v: Vec3| Vec2::new(v.dot(x), v.dot(y));
    let wires: Vec<_> = std::iter::once(face.outer_wire())
        .chain(face.inner_wires().iter().copied())
        .map(|w| topo.wire(w))
        .collect::<Result<_, _>>()?;
    // A NURBS edge declines before any curve is projected: finding its
    // span costs point projections the caller's fallback repeats.
    for wire in &wires {
        for oe in wire.edges() {
            if matches!(topo.edge(oe.edge())?.curve(), EdgeCurve::NurbsCurve(_)) {
                return Ok(None);
            }
        }
    }
    let mut pieces = Vec::new();
    for wire in &wires {
        for oe in wire.edges() {
            let edge = topo.edge(oe.edge())?;
            let (a, b) = (
                topo.vertex(edge.start())?.point(),
                topo.vertex(edge.end())?.point(),
            );
            let curve = edge.curve();
            pieces.push(match curve {
                EdgeCurve::Line | EdgeCurve::NurbsCurve(_) => Boundary2::Segment(flat(a), flat(b)),
                EdgeCurve::Circle(c) => {
                    let (t0, t1) = curve.domain_with_endpoints(a, b);
                    Boundary2::Arc {
                        center: flat(c.center()),
                        u: along(c.u_axis()),
                        v: along(c.v_axis()),
                        a: c.radius(),
                        b: c.radius(),
                        t0,
                        t1,
                    }
                }
                EdgeCurve::Ellipse(e) => {
                    let (t0, t1) = curve.domain_with_endpoints(a, b);
                    Boundary2::Arc {
                        center: flat(e.center()),
                        u: along(e.u_axis()),
                        v: along(e.v_axis()),
                        a: e.semi_major(),
                        b: e.semi_minor(),
                        t0,
                        t1,
                    }
                }
            });
        }
    }
    Ok(Some(pieces))
}

/// The signed area a wire encloses in the plane spanned by the orthonormal
/// `x` and `y`: positive when it winds counterclockwise about `x × y`.
///
/// Exact for lines and conic arcs, so it does not depend on how a loop's
/// curves are split into edges. A NURBS edge is integrated knot span by
/// knot span; `None` when a rational span's weights are so steep that its
/// halving budget runs out before the area settles.
///
/// # Errors
///
/// Returns [`TopologyError`] if an entity lookup fails.
pub fn wire_area_2d(
    topo: &Topology,
    wire: WireId,
    x: Vec3,
    y: Vec3,
) -> Result<Option<f64>, TopologyError> {
    loop_area_2d(topo, topo.wire(wire)?.edges(), x, y)
}

/// [`wire_area_2d`] for a closed run of oriented edges not yet made a wire.
///
/// # Errors
///
/// Returns [`TopologyError`] if an entity lookup fails.
pub fn loop_area_2d(
    topo: &Topology,
    edges: &[OrientedEdge],
    x: Vec3,
    y: Vec3,
) -> Result<Option<f64>, TopologyError> {
    let Some(first) = edges.first() else {
        return Ok(Some(0.0));
    };
    // Read about a point of the loop, not the world origin: far from it the
    // swept areas below are large and cancel to the loop's small one.
    let origin = topo
        .vertex(first.oriented_start(topo.edge(first.edge())?))?
        .point();
    let along = |v: Vec3| (v.dot(x), v.dot(y));
    let flat = |p: Point3| along(p - origin);
    let cross = |a: (f64, f64), b: (f64, f64)| a.0 * b.1 - a.1 * b.0;
    let mut twice = 0.0;
    for oe in edges {
        let edge = topo.edge(oe.edge())?;
        let (a, b) = (
            topo.vertex(edge.start())?.point(),
            topo.vertex(edge.end())?.point(),
        );
        let curve = edge.curve();
        // Twice the area swept about `origin` from the edge's start vertex
        // to its end. On a conic `c + A cos t u + B sin t v` that is
        // `c × (end - start) + A B (u × v) (t1 - t0)`.
        let conic = |c: Point3, u: Vec3, v: Vec3, semi_a: f64, semi_b: f64| {
            let (t0, t1) = curve.domain_with_endpoints(a, b);
            let (fa, fb) = (flat(a), flat(b));
            cross(flat(c), (fb.0 - fa.0, fb.1 - fa.1))
                + semi_a * semi_b * cross(along(u), along(v)) * (t1 - t0)
        };
        let swept = match curve {
            EdgeCurve::Line => cross(flat(a), flat(b)),
            EdgeCurve::Circle(c) => {
                conic(c.center(), c.u_axis(), c.v_axis(), c.radius(), c.radius())
            }
            EdgeCurve::Ellipse(e) => conic(
                e.center(),
                e.u_axis(),
                e.v_axis(),
                e.semi_major(),
                e.semi_minor(),
            ),
            EdgeCurve::NurbsCurve(n) => {
                let (t0, t1) = curve.domain_with_endpoints(a, b);
                let Some(swept) = nurbs_swept(n, t0, t1, origin, x, y) else {
                    return Ok(None);
                };
                swept
            }
        };
        twice += if oe.is_forward() { swept } else { -swept };
    }
    Ok(Some(0.5 * twice))
}

/// Twice the area a NURBS curve sweeps about `origin` from `t0` to `t1`
/// (either way round) in the plane of `x` and `y`: `∫ q × q' dt` by Gauss
/// quadrature on each knot span, on the curve moved to `origin` so a
/// rational curve's derivatives do not cancel far from the world's.
///
/// A polynomial span's integrand is a polynomial the rule integrates
/// exactly. A rational span's is not, and steep weights crowd the curve
/// into a sliver of its span where no node may fall, so a piece is taken
/// only when its two halves agree with it and its points keep near the
/// chord's at the same fractions (its speed spread over it); otherwise it is
/// halved. `None` if a piece still fails after `MAX_HALVINGS` halvings.
fn nurbs_swept(
    curve: &NurbsCurve,
    t0: f64,
    t1: f64,
    origin: Point3,
    x: Vec3,
    y: Vec3,
) -> Option<f64> {
    const MAX_HALVINGS: u32 = 48;
    let o = Vec3::new(origin.x(), origin.y(), origin.z());
    let curve = NurbsCurve::new(
        curve.degree(),
        curve.knots().to_vec(),
        curve
            .control_points()
            .iter()
            .map(|&c| Point3::new(c.x() - o.x(), c.y() - o.y(), c.z() - o.z()))
            .collect(),
        curve.weights().to_vec(),
    )
    .ok()?;
    let (lo, hi) = (t0.min(t1), t0.max(t1));
    let rational = curve.is_rational();
    let points = quadrature::gauss_legendre_points(if rational {
        quadrature::MAX_ORDER
    } else {
        curve.degree() + 1
    });
    let gauss = |a: f64, b: f64| {
        let (mid, half) = (0.5 * (a + b), 0.5 * (b - a));
        points
            .iter()
            .map(|g| {
                let d = curve.derivatives(half.mul_add(g.x, mid), 1);
                let (Some(&q), Some(&dq)) = (d.first(), d.get(1)) else {
                    return 0.0;
                };
                g.w * half * (q.dot(x) * dq.dot(y) - q.dot(y) * dq.dot(x))
            })
            .sum::<f64>()
    };
    // Whether the curve keeps within half the chord's length of the chord's
    // own point at a quarter, a half and three quarters along.
    let even = |a: f64, b: f64| {
        let (pa, pb) = (curve.evaluate(a), curve.evaluate(b));
        let chord = (pb - pa).length();
        [0.25_f64, 0.5, 0.75].iter().all(|&f| {
            let on = curve.evaluate(f.mul_add(b - a, a));
            (on - (pa + (pb - pa) * f)).length() <= 0.5 * chord
        })
    };
    // The swept area's scale, for the agreement test: the control points'
    // reach from `origin` times their spread.
    let (reach, spread) = {
        let cps = curve.control_points();
        let reach = cps
            .iter()
            .map(|c| Vec3::new(c.x(), c.y(), c.z()).length())
            .fold(0.0, f64::max);
        let lo_hi = cps.iter().fold(None, |acc: Option<(Point3, Point3)>, c| {
            Some(acc.map_or((*c, *c), |(a, b)| {
                (
                    Point3::new(a.x().min(c.x()), a.y().min(c.y()), a.z().min(c.z())),
                    Point3::new(b.x().max(c.x()), b.y().max(c.y()), b.z().max(c.z())),
                )
            }))
        });
        (reach, lo_hi.map_or(0.0, |(a, b)| (b - a).length()))
    };
    let tolerance = 1e-13 * reach.max(spread) * spread;
    let mut cuts = vec![lo];
    cuts.extend(curve.knots().iter().copied().filter(|&k| k > lo && k < hi));
    cuts.push(hi);
    cuts.dedup();
    let mut total = 0.0;
    for span in cuts.windows(2) {
        if !rational {
            total += gauss(span[0], span[1]);
            continue;
        }
        let mut pending = vec![(span[0], span[1], gauss(span[0], span[1]), 0)];
        while let Some((a, b, whole, depth)) = pending.pop() {
            let m = 0.5 * (a + b);
            let (left, right) = (gauss(a, m), gauss(m, b));
            if (left + right - whole).abs() <= tolerance && even(a, b) {
                total += left + right;
            } else if depth >= MAX_HALVINGS {
                return None;
            } else {
                pending.push((a, m, left, depth + 1));
                pending.push((m, b, right, depth + 1));
            }
        }
    }
    Some(if t1 < t0 { -total } else { total })
}

#[cfg(test)]
mod tests {
    #![allow(clippy::unwrap_used)]
    use brepkit_math::curves::Circle3D;
    use brepkit_math::nurbs::curve::NurbsCurve;
    use brepkit_math::region2d::point_in_region;

    use super::*;
    use crate::edge::Edge;
    use crate::face::{Face, FaceSurface};
    use crate::vertex::Vertex;
    use crate::wire::{OrientedEdge, Wire};

    /// The upper half of the unit disc in `z = 0`, its diameter a line, or a
    /// straight NURBS when `nurbs`.
    fn half_disc(topo: &mut Topology, nurbs: bool) -> FaceId {
        let (a, b) = (Point3::new(1.0, 0.0, 0.0), Point3::new(-1.0, 0.0, 0.0));
        let (va, vb) = (
            topo.add_vertex(Vertex::new(a, 1e-7)),
            topo.add_vertex(Vertex::new(b, 1e-7)),
        );
        let circle =
            Circle3D::new(Point3::new(0.0, 0.0, 0.0), Vec3::new(0.0, 0.0, 1.0), 1.0).unwrap();
        let arc = topo.add_edge(Edge::new(va, vb, EdgeCurve::Circle(circle)));
        let curve = if nurbs {
            EdgeCurve::NurbsCurve(
                NurbsCurve::new(1, vec![0.0, 0.0, 1.0, 1.0], vec![b, a], vec![1.0, 1.0]).unwrap(),
            )
        } else {
            EdgeCurve::Line
        };
        let diameter = topo.add_edge(Edge::new(vb, va, curve));
        let wire = Wire::new(
            vec![
                OrientedEdge::new(arc, true),
                OrientedEdge::new(diameter, true),
            ],
            true,
        )
        .unwrap();
        let wire = topo.add_wire(wire);
        topo.add_face(Face::new(
            wire,
            vec![],
            FaceSurface::Plane {
                normal: Vec3::new(0.0, 0.0, 1.0),
                d: 0.0,
            },
        ))
    }

    /// A half disc flattens to its arc and its diameter: a point just inside
    /// the arc reads inside, one past the diameter outside.
    #[test]
    fn a_half_disc_flattens_to_its_arc_and_diameter() {
        let mut topo = Topology::new();
        let face = half_disc(&mut topo, false);
        let (x, y) = (Vec3::new(1.0, 0.0, 0.0), Vec3::new(0.0, 1.0, 0.0));
        let pieces = face_boundary_2d(&topo, face, Point3::new(0.0, 0.0, 0.0), x, y)
            .unwrap()
            .unwrap();
        assert_eq!(pieces.len(), 2);
        let inside = |px: f64, py: f64| point_in_region(&pieces, Point2::new(px, py), 1e-9);
        assert_eq!(inside(0.0, 0.999), Some(true));
        assert_eq!(inside(0.7, 0.7), Some(true));
        assert_eq!(inside(0.0, -0.01), Some(false));
    }

    /// A loop of `edges`, each `(edge, forward)`.
    fn wire_of(topo: &mut Topology, edges: &[(crate::edge::EdgeId, bool)]) -> WireId {
        let oes = edges
            .iter()
            .map(|&(e, forward)| OrientedEdge::new(e, forward))
            .collect();
        topo.add_wire(Wire::new(oes, true).unwrap())
    }

    const XY: (Vec3, Vec3) = (Vec3::new(1.0, 0.0, 0.0), Vec3::new(0.0, 1.0, 0.0));

    /// A disc's area is the same whether its circle is one closed edge or two
    /// half circles, far from the origin, and turns negative run backward.
    #[test]
    fn a_disc_reads_its_exact_area_however_its_circle_is_split() {
        let mut topo = Topology::new();
        let c = Point3::new(300.0, -200.0, 1000.0);
        let circle = Circle3D::new(c, Vec3::new(0.0, 0.0, 1.0), 4.0).unwrap();
        let east = topo.add_vertex(Vertex::new(Point3::new(304.0, -200.0, 1000.0), 1e-7));
        let west = topo.add_vertex(Vertex::new(Point3::new(296.0, -200.0, 1000.0), 1e-7));
        let whole = topo.add_edge(Edge::new(east, east, EdgeCurve::Circle(circle.clone())));
        let upper = topo.add_edge(Edge::new(east, west, EdgeCurve::Circle(circle.clone())));
        let lower = topo.add_edge(Edge::new(west, east, EdgeCurve::Circle(circle)));
        let one = wire_of(&mut topo, &[(whole, true)]);
        let two = wire_of(&mut topo, &[(upper, true), (lower, true)]);
        let back = wire_of(&mut topo, &[(lower, false), (upper, false)]);
        let disc = 16.0 * std::f64::consts::PI;
        let (x, y) = XY;
        for (w, want) in [(one, disc), (two, disc), (back, -disc)] {
            let area = wire_area_2d(&topo, w, x, y).unwrap().unwrap();
            assert!((area - want).abs() < 1e-9, "{area} vs {want}");
        }
    }

    /// A half ellipse closed by its major axis: half of `pi a b`.
    #[test]
    fn a_half_ellipse_reads_half_its_area() {
        let mut topo = Topology::new();
        let ellipse = brepkit_math::curves::Ellipse3D::new(
            Point3::new(0.0, 0.0, 0.0),
            Vec3::new(0.0, 0.0, 1.0),
            3.0,
            2.0,
        )
        .unwrap();
        let (u, v) = (ellipse.u_axis(), ellipse.v_axis());
        assert!(u.cross(v).z() > 0.0);
        let a = Point3::new(3.0 * u.x(), 3.0 * u.y(), 0.0);
        let b = Point3::new(-a.x(), -a.y(), 0.0);
        let (va, vb) = (
            topo.add_vertex(Vertex::new(a, 1e-7)),
            topo.add_vertex(Vertex::new(b, 1e-7)),
        );
        let arc = topo.add_edge(Edge::new(va, vb, EdgeCurve::Ellipse(ellipse)));
        let axis = topo.add_edge(Edge::new(vb, va, EdgeCurve::Line));
        let w = wire_of(&mut topo, &[(arc, true), (axis, true)]);
        let (x, y) = XY;
        let area = wire_area_2d(&topo, w, x, y).unwrap().unwrap();
        assert!((area - 3.0 * std::f64::consts::PI).abs() < 1e-9, "{area}");
    }

    /// A rational half circle reads its exact area, run with its curve and,
    /// as an edge stored against its curve, the other way round.
    #[test]
    fn a_rational_half_circle_reads_its_exact_area() {
        let s = std::f64::consts::FRAC_1_SQRT_2;
        let curve = NurbsCurve::new(
            2,
            vec![0.0, 0.0, 0.0, 0.5, 0.5, 1.0, 1.0, 1.0],
            vec![
                Point3::new(1.0, 0.0, 0.0),
                Point3::new(1.0, 1.0, 0.0),
                Point3::new(0.0, 1.0, 0.0),
                Point3::new(-1.0, 1.0, 0.0),
                Point3::new(-1.0, 0.0, 0.0),
            ],
            vec![1.0, s, 1.0, s, 1.0],
        )
        .unwrap();
        let half = std::f64::consts::FRAC_PI_2;
        let (x, y) = XY;
        for (against, want) in [(false, half), (true, -half)] {
            let mut topo = Topology::new();
            let east = topo.add_vertex(Vertex::new(Point3::new(1.0, 0.0, 0.0), 1e-7));
            let west = topo.add_vertex(Vertex::new(Point3::new(-1.0, 0.0, 0.0), 1e-7));
            let (from, to) = if against { (west, east) } else { (east, west) };
            let arc = topo.add_edge(Edge::new(from, to, EdgeCurve::NurbsCurve(curve.clone())));
            let chord = topo.add_edge(Edge::new(to, from, EdgeCurve::Line));
            let w = wire_of(&mut topo, &[(arc, true), (chord, true)]);
            let area = wire_area_2d(&topo, w, x, y).unwrap().unwrap();
            assert!((area - want).abs() < 1e-9, "{area} vs {want}");
        }
    }

    /// The quarter disc at `at`, its arc a rational quadratic with the middle
    /// and last weights `w1` and `w2` (the standard ones, `1/√2` and 1,
    /// times `c` and `c²` give the same arc reparametrized), closed by two
    /// radii; its area as read.
    fn quarter_disc_area(at: (f64, f64), w1: f64, w2: f64) -> Option<f64> {
        let p = |x: f64, y: f64| Point3::new(at.0 + x, at.1 + y, 0.0);
        let curve = NurbsCurve::new(
            2,
            vec![0.0, 0.0, 0.0, 1.0, 1.0, 1.0],
            vec![p(1.0, 0.0), p(1.0, 1.0), p(0.0, 1.0)],
            vec![1.0, w1, w2],
        )
        .unwrap();
        let mut topo = Topology::new();
        let o = topo.add_vertex(Vertex::new(p(0.0, 0.0), 1e-7));
        let east = topo.add_vertex(Vertex::new(p(1.0, 0.0), 1e-7));
        let north = topo.add_vertex(Vertex::new(p(0.0, 1.0), 1e-7));
        let to_east = topo.add_edge(Edge::new(o, east, EdgeCurve::Line));
        let arc = topo.add_edge(Edge::new(east, north, EdgeCurve::NurbsCurve(curve)));
        let back = topo.add_edge(Edge::new(north, o, EdgeCurve::Line));
        let w = wire_of(&mut topo, &[(to_east, true), (arc, true), (back, true)]);
        let (x, y) = XY;
        wire_area_2d(&topo, w, x, y).unwrap()
    }

    /// A quarter circle read the same far from the origin and with steep
    /// weights, which crowd most of the arc into a sliver of its domain.
    #[test]
    fn a_steeply_weighted_quarter_circle_reads_its_exact_area() {
        let s = std::f64::consts::FRAC_1_SQRT_2;
        let quarter = std::f64::consts::FRAC_PI_4;
        for (at, c) in [
            ((0.0, 0.0), 1.0),
            ((1e6, 1e6), 1.0),
            ((0.0, 0.0), 300.0),
            ((1e6, -1e6), 300.0),
        ] {
            let area = quarter_disc_area(at, c * s, c * c).unwrap();
            assert!((area - quarter).abs() < 1e-9, "at {at:?}, c {c}: {area}");
        }
    }

    /// Weights so steep that the arc runs within 1e-20 of its domain's end:
    /// the area reads exactly or not at all, never as the near-zero the
    /// quadrature nodes see.
    #[test]
    fn a_quarter_circle_too_steep_to_settle_reads_nothing_rather_than_wrong() {
        let s = std::f64::consts::FRAC_1_SQRT_2;
        let area = quarter_disc_area((0.0, 0.0), 1e20 * s, 1e40);
        if let Some(area) = area {
            assert!((area - std::f64::consts::FRAC_PI_4).abs() < 1e-9, "{area}");
        }
    }

    /// A NURBS edge declines the flattening.
    #[test]
    fn a_nurbs_edge_declines() {
        let mut topo = Topology::new();
        let face = half_disc(&mut topo, true);
        let (x, y) = (Vec3::new(1.0, 0.0, 0.0), Vec3::new(0.0, 1.0, 0.0));
        assert!(
            face_boundary_2d(&topo, face, Point3::new(0.0, 0.0, 0.0), x, y)
                .unwrap()
                .is_none()
        );
    }
}
