//! A planar face's boundary flattened into its plane.

use brepkit_math::nurbs::curve::NurbsCurve;
use brepkit_math::nurbs::decompose::curve_bezier_between;
use brepkit_math::region2d::{Boundary2, distance_to_boundary, point_in_region};
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

/// A rational Bezier piece of a NURBS edge in the plane, and the chord
/// standing for it.
#[derive(Debug, Clone)]
struct BezierPiece {
    /// Control points in homogeneous form `[w x, w y, w]`, every weight
    /// positive.
    hull: Vec<[f64; 3]>,
    /// The chord's first end: the edge's vertex at its start, else the curve
    /// where the piece begins.
    start: Point2,
    /// The chord's last end, likewise.
    end: Point2,
}

/// How a NURBS piece stands to a point.
enum Reading {
    /// The point lies farther from the chord than the margin plus the
    /// piece's bound, so the chord may stand for the piece.
    Chord,
    /// An end of the chord, a point of the boundary, lies within the margin.
    Touches,
    /// Neither: the piece must be halved.
    Unsettled,
}

impl BezierPiece {
    /// The farthest a control point lies from the chord. With positive
    /// weights the piece, and the sliver between it and its chord, lie in
    /// the hull of the control points and the chord's ends, so no point of
    /// either lies farther.
    fn bound(&self) -> f64 {
        self.hull
            .iter()
            .map(|&[x, y, w]| distance_to_segment(Point2::new(x / w, y / w), self.start, self.end))
            .fold(0.0, f64::max)
    }

    fn read(&self, p: Point2, margin: f64) -> Reading {
        if distance_to_segment(p, self.start, self.end) > margin + self.bound() {
            Reading::Chord
        } else if (p - self.start).length() <= margin || (p - self.end).length() <= margin {
            Reading::Touches
        } else {
            Reading::Unsettled
        }
    }

    /// The piece split at its middle parameter, by de Casteljau in
    /// homogeneous form.
    fn halves(&self) -> (Self, Self) {
        let mut work = self.hull.clone();
        let n = work.len();
        let mut left = Vec::with_capacity(n);
        let mut right = Vec::with_capacity(n);
        for r in 0..n {
            if r > 0 {
                for j in 0..n - r {
                    let (a, b) = (work[j], work[j + 1]);
                    work[j] = [
                        0.5 * (a[0] + b[0]),
                        0.5 * (a[1] + b[1]),
                        0.5 * (a[2] + b[2]),
                    ];
                }
            }
            left.push(work[0]);
            right.push(work[n - 1 - r]);
        }
        right.reverse();
        let [x, y, w] = work[0];
        let mid = Point2::new(x / w, y / w);
        (
            Self {
                hull: left,
                start: self.start,
                end: mid,
            },
            Self {
                hull: right,
                start: mid,
                end: self.end,
            },
        )
    }
}

/// The distance from `p` to the segment from `a` to `b`.
fn distance_to_segment(p: Point2, a: Point2, b: Point2) -> f64 {
    let (ab, ap) = (b - a, p - a);
    let len2 = ab.dot(ab);
    let t = if len2 > 0.0 {
        (ap.dot(ab) / len2).clamp(0.0, 1.0)
    } else {
        0.0
    };
    (ap - ab * t).length()
}

/// The most halvings of NURBS pieces one containment query makes.
const MAX_HALVINGS: usize = 4096;

/// A planar face's region in its plane, a NURBS edge as rational Bezier
/// pieces whose control points bound it.
#[derive(Debug, Clone)]
pub struct PlanarRegion {
    exact: Vec<Boundary2>,
    beziers: Vec<BezierPiece>,
    /// The linear tolerance: a piece shorter than it is a point when
    /// crossings are counted.
    tol: f64,
}

impl PlanarRegion {
    /// Whether `p` lies inside the face and farther than `margin` from its
    /// boundary, a NURBS edge read along its curve.
    ///
    /// The clearance is each line's, circle's, and ellipse's own distance
    /// from `p`. A NURBS piece whose chord lies farther from `p` than
    /// `margin` plus the piece's bound stands as that chord: `p` then lies
    /// outside the sliver between the chord and the curve, so on the same
    /// side of both, and farther than `margin` from the curve. A nearer
    /// piece is halved until it stands so. A chord ending within `margin` of
    /// `p`, or a query that runs out of halvings, reads `false`.
    ///
    /// The side is read by counting crossings at the smaller of `margin`
    /// and the linear tolerance, so a piece shorter than the margin still
    /// counts, and a point already clear by `margin` never reads as on the
    /// boundary there.
    #[must_use]
    pub fn contains_clear(&self, p: Point2, margin: f64) -> bool {
        if distance_to_boundary(&self.exact, p) <= margin {
            return false;
        }
        let mut pieces = Vec::with_capacity(self.exact.len() + self.beziers.len());
        pieces.extend_from_slice(&self.exact);
        let mut pending: Vec<BezierPiece> = Vec::new();
        let mut halvings = 0_usize;
        let mut whole = self.beziers.iter();
        loop {
            let owned;
            let piece = if let Some(half) = pending.pop() {
                owned = half;
                &owned
            } else if let Some(piece) = whole.next() {
                piece
            } else {
                break;
            };
            match piece.read(p, margin) {
                Reading::Chord => pieces.push(Boundary2::Segment(piece.start, piece.end)),
                Reading::Touches => return false,
                Reading::Unsettled => {
                    if halvings == MAX_HALVINGS {
                        return false;
                    }
                    halvings += 1;
                    let (first, second) = piece.halves();
                    pending.push(second);
                    pending.push(first);
                }
            }
        }
        point_in_region(&pieces, p, margin.min(self.tol)) == Some(true)
    }
}

/// A planar face's region in its plane, holes included: lines, circles, and
/// ellipses flattened as [`face_boundary_2d`] flattens them, and each NURBS
/// edge as the rational Bezier pieces of its knot spans.
///
/// `tol` is the linear tolerance, below which a piece is too short to count
/// a crossing. `None` when a NURBS edge's piece of its curve has a weight of
/// zero or less, where its control points no longer bound it, or spans no
/// parameters.
///
/// # Errors
///
/// Returns [`TopologyError`] if an entity lookup fails.
pub fn face_region_2d(
    topo: &Topology,
    face: FaceId,
    origin: Point3,
    x: Vec3,
    y: Vec3,
    tol: f64,
) -> Result<Option<PlanarRegion>, TopologyError> {
    let face = topo.face(face)?;
    let plane = Plane2 { origin, x, y };
    let mut exact = Vec::new();
    let mut beziers = Vec::new();
    for wid in std::iter::once(face.outer_wire()).chain(face.inner_wires().iter().copied()) {
        for oe in topo.wire(wid)?.edges() {
            let edge = topo.edge(oe.edge())?;
            let (a, b) = (
                topo.vertex(edge.start())?.point(),
                topo.vertex(edge.end())?.point(),
            );
            let curve = edge.curve();
            if let Some(piece) = plane.exact_piece(curve, a, b) {
                exact.push(piece);
            } else if let EdgeCurve::NurbsCurve(n) = curve {
                let span = curve.domain_with_endpoints(a, b);
                if !bezier_pieces(n, span, a, b, plane, &mut beziers) {
                    return Ok(None);
                }
            }
        }
    }
    Ok(Some(PlanarRegion {
        exact,
        beziers,
        tol,
    }))
}

/// The rational Bezier pieces of `curve` from parameter `t0` (at `a`) to
/// `t1` (at `b`), one per knot span, appended to `out`; `false` when a
/// weight is zero or less or the range is empty.
fn bezier_pieces(
    curve: &NurbsCurve,
    (t0, t1): (f64, f64),
    a: Point3,
    b: Point3,
    plane: Plane2,
    out: &mut Vec<BezierPiece>,
) -> bool {
    let (d0, d1) = curve.domain();
    let (lo, hi) = (t0.min(t1).max(d0), t0.max(t1).min(d1));
    let mut breaks: Vec<f64> = std::iter::once(lo)
        .chain(curve.knots().iter().copied().filter(|&k| k > lo && k < hi))
        .chain(std::iter::once(hi))
        .collect();
    breaks.dedup();
    if breaks.len() < 2 {
        return false;
    }
    if t0 > t1 {
        breaks.reverse();
    }
    let spans = breaks.len() - 1;
    let mut start = plane.point(a);
    for (i, w) in breaks.windows(2).enumerate() {
        let Ok(bezier) = curve_bezier_between(curve, w[0], w[1]) else {
            return false;
        };
        let mut hull = Vec::with_capacity(bezier.len());
        for [hx, hy, hz, hw] in bezier {
            if hw <= 0.0 {
                return false;
            }
            let flat = plane.point(Point3::new(hx / hw, hy / hw, hz / hw));
            hull.push([flat.x() * hw, flat.y() * hw, hw]);
        }
        let end = if i + 1 == spans {
            plane.point(b)
        } else if let Some(&[hx, hy, hw]) = hull.last() {
            Point2::new(hx / hw, hy / hw)
        } else {
            return false;
        };
        out.push(BezierPiece { hull, start, end });
        start = end;
    }
    true
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

    /// The region of a face in `z = 0`, read in the plane's own axes.
    fn region(topo: &Topology, face: FaceId) -> Option<PlanarRegion> {
        let (x, y) = (Vec3::new(1.0, 0.0, 0.0), Vec3::new(0.0, 1.0, 0.0));
        face_region_2d(topo, face, Point3::new(0.0, 0.0, 0.0), x, y, 1e-9).unwrap()
    }

    /// A straight NURBS diameter is one piece, its chord, bounding it
    /// exactly.
    #[test]
    fn a_straight_nurbs_edge_reads_as_its_line() {
        let mut topo = Topology::new();
        let face = half_disc(&mut topo, true);
        let region = region(&topo, face).unwrap();
        assert_eq!(region.exact.len(), 1);
        assert_eq!(region.beziers.len(), 1);
        assert!(region.beziers[0].bound() < 1e-12);
        assert!(region.contains_clear(Point2::new(0.0, 0.5), 1e-9));
        assert!(!region.contains_clear(Point2::new(0.0, -0.01), 1e-9));
    }

    /// The upper half of the unit disc in `z = 0` with its arc a rational
    /// quadratic NURBS whose corner weights are `w`, stored against the
    /// edge's direction when `reversed`.
    fn nurbs_half_disc(topo: &mut Topology, reversed: bool, w: f64) -> FaceId {
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

    /// A NURBS half circle is a piece per knot span chained from its start
    /// vertex to its end, whichever way its curve runs, and it is read along
    /// the curve to within the margin, however near.
    #[test]
    fn a_curved_nurbs_edge_reads_along_its_curve() {
        for reversed in [false, true] {
            let mut topo = Topology::new();
            let face = nurbs_half_disc(&mut topo, reversed, std::f64::consts::FRAC_1_SQRT_2);
            let region = region(&topo, face).unwrap();
            let pieces = &region.beziers;
            assert_eq!(pieces.len(), 2);
            assert!((pieces[0].start - Point2::new(1.0, 0.0)).length() < 1e-12);
            assert!((pieces[0].end - Point2::new(0.0, 1.0)).length() < 1e-12);
            assert!((pieces[1].start - pieces[0].end).length() < 1e-15);
            assert!((pieces[1].end - Point2::new(-1.0, 0.0)).length() < 1e-12);
            let clear = |px: f64, py: f64| region.contains_clear(Point2::new(px, py), 1e-9);
            let (c, s) = (1.0_f64.cos(), 1.0_f64.sin());
            assert!(clear(0.0, 0.5));
            assert!(clear(0.7, 0.7));
            assert!(clear(c * (1.0 - 1e-6), s * (1.0 - 1e-6)));
            assert!(!clear(c * (1.0 + 1e-6), s * (1.0 + 1e-6)));
            assert!(!clear(c * (1.0 - 1e-10), s * (1.0 - 1e-10)));
            assert!(!clear(0.0, -0.01));
        }
    }

    /// A weight of zero or less leaves the control points no hull of the
    /// curve, so the region is not read at all.
    #[test]
    fn a_nonpositive_weight_declines_the_region() {
        for w in [0.0, -0.5] {
            let mut topo = Topology::new();
            let face = nurbs_half_disc(&mut topo, false, w);
            assert!(region(&topo, face).is_none(), "weight {w}");
        }
    }

    /// The face below the quintic `x = t`, `y = 32 t (t - 1/4) (t - 1/2)
    /// (t - 3/4) (t - 1)` from `(0, 0)` to `(1, 0)`, closed by the unit
    /// square beneath. The curve meets its chord at a quarter, a half, and
    /// three quarters along, and dips to `y = -0.1025` at `t = 7/8`.
    fn below_a_wavy_quintic(topo: &mut Topology) -> FaceId {
        let corners = [(0.0, 0.0), (1.0, 0.0), (1.0, -1.0), (0.0, -1.0)];
        let v: Vec<_> = corners
            .iter()
            .map(|&(px, py)| topo.add_vertex(Vertex::new(Point3::new(px, py, 0.0), 1e-7)))
            .collect();
        let points = [0.0, 0.6, -1.3, 1.3, -0.6, 0.0]
            .iter()
            .zip(0_u8..)
            .map(|(&py, j)| Point3::new(f64::from(j) / 5.0, py, 0.0))
            .collect();
        let mut knots = vec![0.0; 6];
        knots.extend([1.0; 6]);
        let wave = NurbsCurve::new(5, knots, points, vec![1.0; 6]).unwrap();
        let mut edges = vec![topo.add_edge(Edge::new(v[0], v[1], EdgeCurve::NurbsCurve(wave)))];
        for k in 1..4 {
            edges.push(topo.add_edge(Edge::new(v[k], v[(k + 1) % 4], EdgeCurve::Line)));
        }
        let wire = Wire::new(
            edges.iter().map(|&e| OrientedEdge::new(e, true)).collect(),
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

    /// Where the wavy quintic dips below its chord, a point between the two
    /// is off the face, and where it rises above, one between is on it.
    #[test]
    fn a_wavy_nurbs_edge_is_read_where_it_leaves_its_chord() {
        let mut topo = Topology::new();
        let face = below_a_wavy_quintic(&mut topo);
        let region = region(&topo, face).unwrap();
        let clear = |px: f64, py: f64| region.contains_clear(Point2::new(px, py), 1e-9);
        assert!(!clear(0.875, -0.05));
        assert!(clear(0.875, -0.2));
        assert!(clear(0.125, 0.05));
        assert!(!clear(0.125, 0.2));
        assert!(clear(0.5, -0.5));
    }

    /// A square face 1000 across with a unit square hole at `(500, 500)`,
    /// each of the hole's sides cut into 1024 pieces: line edges, or the
    /// knot spans of one degree-1 NURBS when `nurbs`.
    fn square_with_a_finely_cut_hole(topo: &mut Topology, nurbs: bool) -> FaceId {
        let square = |corner: (f64, f64), side: f64, cuts: u32| {
            let along = |k: u32| side * f64::from(k) / f64::from(cuts);
            let mut points = Vec::new();
            for k in 0..cuts {
                points.push(Point3::new(corner.0 + along(k), corner.1, 0.0));
            }
            for k in 0..cuts {
                points.push(Point3::new(corner.0 + side, corner.1 + along(k), 0.0));
            }
            for k in 0..cuts {
                points.push(Point3::new(
                    corner.0 + side - along(k),
                    corner.1 + side,
                    0.0,
                ));
            }
            for k in 0..cuts {
                points.push(Point3::new(corner.0, corner.1 + side - along(k), 0.0));
            }
            points
        };
        let polygon = |topo: &mut Topology, points: &[Point3]| {
            let v: Vec<_> = points
                .iter()
                .map(|&p| topo.add_vertex(Vertex::new(p, 1e-7)))
                .collect();
            let edges = (0..v.len())
                .map(|k| {
                    let e = topo.add_edge(Edge::new(v[k], v[(k + 1) % v.len()], EdgeCurve::Line));
                    OrientedEdge::new(e, true)
                })
                .collect();
            topo.add_wire(Wire::new(edges, true).unwrap())
        };
        let outer = polygon(topo, &square((0.0, 0.0), 1000.0, 1));
        let mut ring = square((499.5, 499.5), 1.0, 1024);
        ring.reverse();
        let hole = if nurbs {
            let n = ring.len();
            ring.push(ring[0]);
            let mut knots = vec![0.0, 0.0];
            knots.extend((1..n).map(|k| k as f64 / n as f64));
            knots.extend([1.0, 1.0]);
            let weights = vec![1.0; ring.len()];
            let seam = topo.add_vertex(Vertex::new(ring[0], 1e-7));
            let curve = NurbsCurve::new(1, knots, ring, weights).unwrap();
            let edge = topo.add_edge(Edge::new(seam, seam, EdgeCurve::NurbsCurve(curve)));
            topo.add_wire(Wire::new(vec![OrientedEdge::new(edge, true)], true).unwrap())
        } else {
            polygon(topo, &ring)
        };
        topo.add_face(Face::new(
            outer,
            vec![hole],
            FaceSurface::Plane {
                normal: Vec3::new(0.0, 0.0, 1.0),
                d: 0.0,
            },
        ))
    }

    /// A hole whose pieces are each shorter than the clearance margin is
    /// still a hole, whether line edges or NURBS knot spans.
    #[test]
    fn a_hole_of_pieces_shorter_than_the_margin_is_still_a_hole() {
        for nurbs in [false, true] {
            let mut topo = Topology::new();
            let face = square_with_a_finely_cut_hole(&mut topo, nurbs);
            let region = region(&topo, face).unwrap();
            let clear = |px: f64, py: f64| region.contains_clear(Point2::new(px, py), 1.414e-3);
            assert!(!clear(500.0, 500.0), "nurbs {nurbs}: the hole's centre");
            assert!(!clear(500.0, 500.4999), "nurbs {nurbs}: inside its top");
            assert!(!clear(500.0, 500.5005), "nurbs {nurbs}: within the margin");
            assert!(clear(500.0, 500.51), "nurbs {nurbs}: just past it");
            assert!(clear(250.0, 250.0), "nurbs {nurbs}: far from it");
        }
    }
}
