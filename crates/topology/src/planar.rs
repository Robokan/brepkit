//! A planar face's boundary flattened into its plane.

use brepkit_math::nurbs::curve::NurbsCurve;
use brepkit_math::region2d::{Boundary2, on_boundary, point_in_region};
use brepkit_math::vec::{Point2, Point3, Vec2, Vec3};

use crate::Topology;
use crate::TopologyError;
use crate::edge::EdgeCurve;
use crate::face::FaceId;

/// The plane through `origin` spanned by the orthonormal `x` and `y`.
#[derive(Clone, Copy)]
struct Plane2 {
    origin: Point3,
    x: Vec3,
    y: Vec3,
}

impl Plane2 {
    fn point(self, p: Point3) -> Point2 {
        let d = p - self.origin;
        Point2::new(d.dot(self.x), d.dot(self.y))
    }

    fn direction(self, v: Vec3) -> Vec2 {
        Vec2::new(v.dot(self.x), v.dot(self.y))
    }

    /// The edge from `a` to `b` along `curve` as the piece it is: `None` for
    /// a NURBS curve, which has no exact piece.
    fn exact_piece(self, curve: &EdgeCurve, a: Point3, b: Point3) -> Option<Boundary2> {
        match curve {
            EdgeCurve::Line => Some(Boundary2::Segment(self.point(a), self.point(b))),
            EdgeCurve::NurbsCurve(_) => None,
            EdgeCurve::Circle(c) => {
                let (t0, t1) = curve.domain_with_endpoints(a, b);
                Some(Boundary2::Arc {
                    center: self.point(c.center()),
                    u: self.direction(c.u_axis()),
                    v: self.direction(c.v_axis()),
                    a: c.radius(),
                    b: c.radius(),
                    t0,
                    t1,
                })
            }
            EdgeCurve::Ellipse(e) => {
                let (t0, t1) = curve.domain_with_endpoints(a, b);
                Some(Boundary2::Arc {
                    center: self.point(e.center()),
                    u: self.direction(e.u_axis()),
                    v: self.direction(e.v_axis()),
                    a: e.semi_major(),
                    b: e.semi_minor(),
                    t0,
                    t1,
                })
            }
        }
    }
}

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
    let plane = Plane2 { origin, x, y };
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
            pieces.extend(plane.exact_piece(edge.curve(), a, b));
        }
    }
    Ok(Some(pieces))
}

/// A planar face's boundary in its plane, a NURBS edge as a chain of chords.
#[derive(Debug, Clone)]
pub struct ChordedBoundary {
    /// Every loop's pieces, the NURBS edges' chords last.
    pub pieces: Vec<Boundary2>,
    /// Where in `pieces` the chords begin.
    pub chords_from: usize,
    /// The farthest a NURBS edge strays from its chords at the probes that
    /// placed them; zero with no NURBS edge.
    pub deviation: f64,
}

impl ChordedBoundary {
    /// The chords standing for NURBS edges.
    #[must_use]
    pub fn chords(&self) -> &[Boundary2] {
        self.pieces.get(self.chords_from..).unwrap_or_default()
    }

    /// Whether `p` lies inside the face and farther than `margin` from its
    /// boundary, the NURBS edges' own curves included.
    ///
    /// The sliver between a chord and its curve lies within the curve's
    /// farthest stray of the chord, which the deviation stands for as far
    /// as the probes catch it. A point farther than `margin` plus the
    /// deviation from every chord therefore lies on the same side of a
    /// NURBS edge as of its chords, and farther than `margin` from it.
    #[must_use]
    pub fn contains_clear(&self, p: Point2, margin: f64) -> bool {
        point_in_region(&self.pieces, p, margin) == Some(true)
            && !on_boundary(self.chords(), p, margin + self.deviation)
    }
}

/// The most chords one knot span of a NURBS edge is cut into.
const MAX_SPAN_CHORDS: u32 = 256;

/// A planar face's boundary flattened into its plane, holes included, as
/// [`face_boundary_2d`] flattens it, except that a NURBS edge becomes a chain
/// of chords instead of declining the face.
///
/// Each knot span of a NURBS edge is cut into a number of chords, doubled
/// until the curve, probed a quarter, a half, and three quarters along each
/// chord, lies within `chord_tol` of the chord's point at the same fraction,
/// or until 256 chords. [`ChordedBoundary::deviation`] reports the farthest
/// probe.
///
/// # Errors
///
/// Returns [`TopologyError`] if an entity lookup fails.
pub fn face_boundary_2d_chorded(
    topo: &Topology,
    face: FaceId,
    origin: Point3,
    x: Vec3,
    y: Vec3,
    chord_tol: f64,
) -> Result<ChordedBoundary, TopologyError> {
    let face = topo.face(face)?;
    let plane = Plane2 { origin, x, y };
    let mut pieces = Vec::new();
    let mut chords = Vec::new();
    let mut deviation = 0.0_f64;
    for wid in std::iter::once(face.outer_wire()).chain(face.inner_wires().iter().copied()) {
        for oe in topo.wire(wid)?.edges() {
            let edge = topo.edge(oe.edge())?;
            let (a, b) = (
                topo.vertex(edge.start())?.point(),
                topo.vertex(edge.end())?.point(),
            );
            let curve = edge.curve();
            if let Some(piece) = plane.exact_piece(curve, a, b) {
                pieces.push(piece);
            } else if let EdgeCurve::NurbsCurve(n) = curve {
                let span = curve.domain_with_endpoints(a, b);
                deviation =
                    deviation.max(chord_nurbs(n, span, a, b, plane, chord_tol, &mut chords));
            }
        }
    }
    let chords_from = pieces.len();
    pieces.extend(chords);
    Ok(ChordedBoundary {
        pieces,
        chords_from,
        deviation,
    })
}

/// Chords along `curve` from parameter `t0` (at `a`) to `t1` (at `b`),
/// appended to `out`; returns the farthest a probe strays from its chord.
fn chord_nurbs(
    curve: &NurbsCurve,
    (t0, t1): (f64, f64),
    a: Point3,
    b: Point3,
    plane: Plane2,
    chord_tol: f64,
    out: &mut Vec<Boundary2>,
) -> f64 {
    let (lo, hi) = (t0.min(t1), t0.max(t1));
    let mut breaks: Vec<f64> = std::iter::once(lo)
        .chain(curve.knots().iter().copied().filter(|&k| k > lo && k < hi))
        .chain(std::iter::once(hi))
        .collect();
    breaks.dedup();
    if t0 > t1 {
        breaks.reverse();
    }
    let at = |t: f64| plane.point(curve.evaluate(t));
    let (first, last) = (plane.point(a), plane.point(b));
    if breaks.len() < 2 {
        out.push(Boundary2::Segment(first, last));
        return 0.0;
    }
    let spans = breaks.len() - 1;
    let mut deviation = 0.0_f64;
    let mut start = first;
    for (i, w) in breaks.windows(2).enumerate() {
        let (s0, s1) = (w[0], w[1]);
        let end = if i + 1 == spans { last } else { at(s1) };
        let mut n = 1_u32;
        loop {
            let param = |k: u32| (s1 - s0).mul_add(f64::from(k) / f64::from(n), s0);
            let points: Vec<Point2> = (0..=n)
                .map(|k| match k {
                    0 => start,
                    k if k == n => end,
                    k => at(param(k)),
                })
                .collect();
            let mut worst = 0.0_f64;
            for (k, chord) in (0_u32..).zip(points.windows(2)) {
                let (u0, u1) = (param(k), param(k + 1));
                for f in [0.25, 0.5, 0.75] {
                    let on_chord = chord[0] + (chord[1] - chord[0]) * f;
                    let on_curve = at((u1 - u0).mul_add(f, u0));
                    worst = worst.max((on_curve - on_chord).length());
                }
            }
            if worst <= chord_tol || n >= MAX_SPAN_CHORDS {
                deviation = deviation.max(worst);
                out.extend(points.windows(2).map(|c| Boundary2::Segment(c[0], c[1])));
                break;
            }
            n *= 2;
        }
        start = end;
    }
    deviation
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

    /// A straight NURBS diameter is one chord, lying on its curve.
    #[test]
    fn a_straight_nurbs_edge_is_one_chord() {
        let mut topo = Topology::new();
        let face = half_disc(&mut topo, true);
        let (x, y) = (Vec3::new(1.0, 0.0, 0.0), Vec3::new(0.0, 1.0, 0.0));
        let region =
            face_boundary_2d_chorded(&topo, face, Point3::new(0.0, 0.0, 0.0), x, y, 1e-6).unwrap();
        assert_eq!(region.pieces.len(), 2);
        assert_eq!(region.chords().len(), 1);
        assert!(region.deviation < 1e-12, "deviation {}", region.deviation);
        assert!(region.contains_clear(Point2::new(0.0, 0.5), 1e-9));
        assert!(!region.contains_clear(Point2::new(0.0, -0.01), 1e-9));
    }

    /// The upper half of the unit disc in `z = 0` with its arc a rational
    /// quadratic NURBS, stored against the edge's direction when `reversed`.
    fn nurbs_half_disc(topo: &mut Topology, reversed: bool) -> FaceId {
        let (a, b) = (Point3::new(1.0, 0.0, 0.0), Point3::new(-1.0, 0.0, 0.0));
        let (va, vb) = (
            topo.add_vertex(Vertex::new(a, 1e-7)),
            topo.add_vertex(Vertex::new(b, 1e-7)),
        );
        let mut points = vec![
            a,
            Point3::new(1.0, 1.0, 0.0),
            Point3::new(0.0, 1.0, 0.0),
            Point3::new(-1.0, 1.0, 0.0),
            b,
        ];
        if reversed {
            points.reverse();
        }
        let w = std::f64::consts::FRAC_1_SQRT_2;
        let arc = NurbsCurve::new(
            2,
            vec![0.0, 0.0, 0.0, 0.5, 0.5, 1.0, 1.0, 1.0],
            points,
            vec![1.0, w, 1.0, w, 1.0],
        )
        .unwrap();
        let arc = topo.add_edge(Edge::new(va, vb, EdgeCurve::NurbsCurve(arc)));
        let diameter = topo.add_edge(Edge::new(vb, va, EdgeCurve::Line));
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

    /// A curved NURBS edge is chorded to within its tolerance from its start
    /// vertex to its end, whichever way its curve runs, and a point clear of
    /// the chords by the deviation reads as the curve places it.
    #[test]
    fn a_curved_nurbs_edge_chords_within_its_tolerance() {
        for reversed in [false, true] {
            let mut topo = Topology::new();
            let face = nurbs_half_disc(&mut topo, reversed);
            let (x, y) = (Vec3::new(1.0, 0.0, 0.0), Vec3::new(0.0, 1.0, 0.0));
            let region =
                face_boundary_2d_chorded(&topo, face, Point3::new(0.0, 0.0, 0.0), x, y, 1e-4)
                    .unwrap();
            let chords = region.chords();
            assert!(chords.len() > 8, "{} chords", chords.len());
            assert!(
                region.deviation > 0.0 && region.deviation <= 1e-4,
                "deviation {}",
                region.deviation
            );
            let ends = |c: &Boundary2| match *c {
                Boundary2::Segment(p, q) => Some((p, q)),
                Boundary2::Arc { .. } => None,
            };
            let ends = |c: &Boundary2| ends(c).unwrap();
            let (first, _) = ends(&chords[0]);
            let (_, last) = ends(&chords[chords.len() - 1]);
            assert!((first - Point2::new(1.0, 0.0)).length() < 1e-12);
            assert!((last - Point2::new(-1.0, 0.0)).length() < 1e-12);
            for w in chords.windows(2) {
                assert!((ends(&w[0]).1 - ends(&w[1]).0).length() < 1e-12);
            }
            let clear = |px: f64, py: f64| region.contains_clear(Point2::new(px, py), 1e-9);
            assert!(clear(0.0, 0.5));
            assert!(clear(0.0, 0.999));
            assert!(clear(0.7, 0.7));
            assert!(!clear(0.0, 1.001));
            assert!(!clear(0.0, -0.01));
        }
    }
}
