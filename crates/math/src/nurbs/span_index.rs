//! A NURBS surface's knot spans indexed by their control boxes, for exact
//! line hits on surfaces too finely spanned for a sampling grid.
//!
//! Over one knot span a B-spline surface with positive weights lies within
//! the convex hull of the control points that shape it, so the box of those
//! points bounds the span. A line meets the surface only in spans whose box
//! it meets, and each such span is solved on its own, so a fitted patch with
//! hundreds of spans is read as finely as its knots, however small a fixed
//! grid over its whole domain would leave each span.

use crate::aabb::Aabb3;
use crate::bvh::Bvh;
use crate::nurbs::surface::NurbsSurface;
use crate::vec::{Point3, Vec3};

/// A parameter interval.
type Interval = (f64, f64);

/// One knot span of a surface: its parameter rectangle.
#[derive(Debug, Clone, Copy)]
struct Span {
    u: (f64, f64),
    v: (f64, f64),
}

/// A surface's knot spans with a BVH over their control boxes.
#[derive(Debug, Clone)]
pub struct SpanIndex {
    spans: Vec<Span>,
    /// Each span's padded control box, by span index.
    boxes: Vec<Aabb3>,
    bvh: Bvh,
    /// The largest control box diagonal, the scale of the surface's pieces.
    scale: f64,
}

/// A point where a line meets the surface.
#[derive(Debug, Clone, Copy)]
pub struct LineHit {
    /// The line's parameter: the hit is `origin + dir * t`.
    pub t: f64,
    /// The surface's parameters at the hit.
    pub uv: (f64, f64),
    /// The hit itself.
    pub point: Point3,
    /// Whether the line meets the surface at a grazing angle there, so the
    /// hit may be a touch rather than a crossing.
    pub grazing: bool,
}

/// The distinct knot spans of one direction: each span's bounds and the
/// index of its last control point.
pub(crate) fn knot_spans(knots: &[f64], degree: usize, n: usize) -> Vec<(f64, f64, usize)> {
    (degree..n)
        .filter(|&i| knots[i + 1] > knots[i])
        .map(|i| (knots[i], knots[i + 1], i))
        .collect()
}

impl SpanIndex {
    /// Index `surface`'s knot spans. `None` when a weight is not positive,
    /// where the control boxes need not bound the surface.
    #[must_use]
    pub fn new(surface: &NurbsSurface) -> Option<Self> {
        let cps = surface.control_points();
        if surface.weights().iter().flatten().any(|&w| w <= 0.0) {
            return None;
        }
        let rows = cps.len();
        let cols = cps.first()?.len();
        let (pu, pv) = (surface.degree_u(), surface.degree_v());
        let spans_u = knot_spans(surface.knots_u(), pu, rows);
        let spans_v = knot_spans(surface.knots_v(), pv, cols);
        let mut spans = Vec::with_capacity(spans_u.len() * spans_v.len());
        let mut boxes = Vec::with_capacity(spans.capacity());
        let mut scale = 0.0_f64;
        for &(u0, u1, last_row) in &spans_u {
            for &(v0, v1, last_col) in &spans_v {
                let aabb = Aabb3::from_points(
                    cps[last_row - pu..=last_row]
                        .iter()
                        .flat_map(|row| row[last_col - pv..=last_col].iter().copied()),
                );
                scale = scale.max((aabb.max - aabb.min).length());
                boxes.push((spans.len(), aabb));
                spans.push(Span {
                    u: (u0, u1),
                    v: (v0, v1),
                });
            }
        }
        // Pad each box for rounding, so a line through a box's face is not
        // lost to its slab test.
        let pad = 1e-9 * scale.max(1.0);
        let boxes: Vec<(usize, Aabb3)> = boxes
            .into_iter()
            .map(|(i, b)| (i, b.expanded(pad)))
            .collect();
        Some(Self {
            spans,
            bvh: Bvh::build(&boxes),
            boxes: boxes.into_iter().map(|(_, b)| b).collect(),
            scale,
        })
    }

    /// The parameter rectangles `(u, v)` of the spans whose control boxes
    /// meet `aabb`, in span order.
    #[must_use]
    pub fn spans_meeting(&self, aabb: &Aabb3) -> Vec<((f64, f64), (f64, f64))> {
        let mut found = self.bvh.query_overlap(aabb);
        found.sort_unstable();
        found
            .into_iter()
            .map(|i| (self.spans[i].u, self.spans[i].v))
            .collect()
    }

    /// Every point where the line `origin + dir * t` meets `surface` (the
    /// surface this index was built from), each found once, in no order.
    ///
    /// Each span whose box the line meets is halved in both parameters,
    /// dropping each piece whose middle lies farther from the line than its
    /// half-widths along the surface's derivatives reach (with a margin for
    /// curvature), and each piece left at the finest level is searched by
    /// Newton's method on `S(u, v) = origin + dir * t` from its middle.
    #[must_use]
    pub fn line_hits(&self, surface: &NurbsSurface, origin: Point3, dir: Vec3) -> Vec<LineHit> {
        const DEPTH: u32 = 4;
        const REACH: f64 = 1.5;
        let mut hits: Vec<LineHit> = Vec::new();
        let dd = dir.dot(dir);
        if dd <= 1e-300 {
            return hits;
        }
        // The BVH's ray query keeps positive t only; a line runs both ways.
        let mut candidates = self.bvh.query_ray(origin, dir);
        candidates.extend(self.bvh.query_ray(origin, -dir));
        candidates.sort_unstable();
        candidates.dedup();
        let off_line = |p: Point3| {
            let w = p - origin;
            (w - dir * (w.dot(dir) / dd)).length()
        };
        let mut stack: Vec<(Interval, Interval, u32)> = Vec::new();
        for idx in candidates {
            let span = self.spans[idx];
            stack.push((span.u, span.v, 0));
            while let Some((u, v, depth)) = stack.pop() {
                let mid = (f64::midpoint(u.0, u.1), f64::midpoint(v.0, v.1));
                let ders = surface.derivatives(mid.0, mid.1, 1);
                let p = ders[0][0];
                let reach = REACH
                    * 0.5
                    * ders[1][0]
                        .length()
                        .mul_add(u.1 - u.0, ders[0][1].length() * (v.1 - v.0));
                if off_line(Point3::new(p.x(), p.y(), p.z())) > reach + 1e-9 * self.scale.max(1.0) {
                    continue;
                }
                if depth < DEPTH {
                    let (um, vm) = mid;
                    for (uu, vv) in [
                        ((u.0, um), (v.0, vm)),
                        ((um, u.1), (v.0, vm)),
                        ((u.0, um), (vm, v.1)),
                        ((um, u.1), (vm, v.1)),
                    ] {
                        stack.push((uu, vv, depth + 1));
                    }
                    continue;
                }
                let Some(hit) = self.solve(surface, origin, dir, mid, (u, v)) else {
                    continue;
                };
                let slack = |(lo, hi): (f64, f64)| 1e-9 * (hi - lo);
                if hit.uv.0 < span.u.0 - slack(span.u)
                    || hit.uv.0 > span.u.1 + slack(span.u)
                    || hit.uv.1 < span.v.0 - slack(span.v)
                    || hit.uv.1 > span.v.1 + slack(span.v)
                {
                    continue;
                }
                // A root on a piece's edge is found from both sides of it.
                let same =
                    |h: &LineHit| (h.point - hit.point).length() <= 1e-9 * self.scale.max(1.0);
                if !hits.iter().any(same) {
                    hits.push(hit);
                }
            }
        }
        hits
    }

    /// The point of `surface` closest to `p`, as `(u, v, distance)`.
    ///
    /// Each span's own closest point is found by Gauss-Newton from its
    /// middle, kept within the span, and the spans are searched nearest box
    /// first: a span whose box lies farther than the best point found so far
    /// holds no closer one. `None` for an empty index.
    #[must_use]
    pub fn closest_point(&self, surface: &NurbsSurface, p: Point3) -> Option<(f64, f64, f64)> {
        let in_span = |i: usize| {
            let span = self.spans[i];
            closest_from(
                surface,
                p,
                (
                    f64::midpoint(span.u.0, span.u.1),
                    f64::midpoint(span.v.0, span.v.1),
                ),
                span.u,
                span.v,
            )
        };
        let best = self
            .bvh
            .query_closest_with_distance(p, &|i| in_span(i).2.powi(2))?;
        Some(in_span(best))
    }

    /// The point of `surface` closest to `p` nearer than `bound`, as `(u, v,
    /// distance)`: only spans whose boxes come nearer than the best point
    /// so far are searched, nearest box first. `None` when no span comes
    /// nearer than `bound`.
    #[must_use]
    pub fn closest_point_within(
        &self,
        surface: &NurbsSurface,
        p: Point3,
        bound: f64,
    ) -> Option<(f64, f64, f64)> {
        let reach = Vec3::new(bound, bound, bound);
        let around = Aabb3 {
            min: p - reach,
            max: p + reach,
        };
        let mut near: Vec<(f64, usize)> = self
            .bvh
            .query_overlap(&around)
            .into_iter()
            .map(|i| (self.boxes[i].distance_squared_to_point(p).sqrt(), i))
            .filter(|&(d, _)| d < bound)
            .collect();
        near.sort_by(|a, b| a.0.total_cmp(&b.0));
        let mut best: Option<(f64, f64, f64)> = None;
        for (box_gap, i) in near {
            if box_gap >= best.map_or(bound, |b| b.2) {
                break;
            }
            let span = self.spans[i];
            let found = closest_from(
                surface,
                p,
                (
                    f64::midpoint(span.u.0, span.u.1),
                    f64::midpoint(span.v.0, span.v.1),
                ),
                span.u,
                span.v,
            );
            if found.2 < best.map_or(bound, |b| b.2) {
                best = Some(found);
            }
        }
        best
    }

    /// Where `p` lies on `surface`, if it lies on it: of the spans whose
    /// boxes hold `p`, the few whose middles lie nearest it are searched by
    /// Gauss-Newton, kept within the span, until one comes within
    /// `tolerance` of `p`; else the nearest found. `None` when no span's box
    /// holds `p` (it lies off the surface).
    #[must_use]
    pub fn locate_on(
        &self,
        surface: &NurbsSurface,
        p: Point3,
        tolerance: f64,
    ) -> Option<(f64, f64, f64)> {
        const TRIED: usize = 4;
        let at = Aabb3 { min: p, max: p };
        let mut holding: Vec<(f64, usize)> = self
            .bvh
            .query_overlap(&at)
            .into_iter()
            .map(|i| {
                let span = self.spans[i];
                let mid = surface.evaluate(
                    f64::midpoint(span.u.0, span.u.1),
                    f64::midpoint(span.v.0, span.v.1),
                );
                ((mid - p).length(), i)
            })
            .collect();
        holding.sort_by(|a, b| a.0.total_cmp(&b.0));
        let mut best: Option<(f64, f64, f64)> = None;
        for &(_, i) in holding.iter().take(TRIED) {
            let span = self.spans[i];
            let found = closest_from(
                surface,
                p,
                (
                    f64::midpoint(span.u.0, span.u.1),
                    f64::midpoint(span.v.0, span.v.1),
                ),
                span.u,
                span.v,
            );
            if best.is_none_or(|b| found.2 < b.2) {
                best = Some(found);
            }
            if found.2 <= tolerance {
                break;
            }
        }
        best
    }

    /// The point of `surface` closest to `p` found by Gauss-Newton from
    /// `guess` over the whole domain, as `(u, v, distance)`: the nearest
    /// point to a point beside one already placed (the next sample along a
    /// curve on the surface), which a search over the whole surface need not
    /// find on a surface with many spans.
    #[must_use]
    pub fn closest_point_near(
        surface: &NurbsSurface,
        p: Point3,
        guess: (f64, f64),
    ) -> (f64, f64, f64) {
        closest_from(surface, p, guess, surface.domain_u(), surface.domain_v())
    }

    /// Newton's method on `S(u, v) - (origin + dir * t)` from `seed`, given
    /// up once it leaves the piece `(u, v)` by more than the piece's width.
    fn solve(
        &self,
        surface: &NurbsSurface,
        origin: Point3,
        dir: Vec3,
        seed: (f64, f64),
        (pu, pv): ((f64, f64), (f64, f64)),
    ) -> Option<LineHit> {
        const MAX_ITER: usize = 30;
        let (u_lo, u_hi) = surface.domain_u();
        let (v_lo, v_hi) = surface.domain_v();
        let (du, dv) = (pu.1 - pu.0, pv.1 - pv.0);
        let u_win = ((pu.0 - du).max(u_lo), (pu.1 + du).min(u_hi));
        let v_win = ((pv.0 - dv).max(v_lo), (pv.1 + dv).min(v_hi));
        let dd = dir.dot(dir);
        let (mut u, mut v) = seed;
        let p = surface.evaluate(u, v);
        let mut t = (p - origin).dot(dir) / dd;
        let tol = 1e-12 * self.scale.max(1.0);
        for _ in 0..MAX_ITER {
            let ders = surface.derivatives(u, v, 1);
            let p = ders[0][0];
            let r = Point3::new(p.x(), p.y(), p.z()) - (origin + dir * t);
            let (su, sv) = (ders[1][0], ders[0][1]);
            let back = -dir;
            let det = su.dot(sv.cross(back));
            let size = su.length() * sv.length() * dir.length();
            if r.length() <= tol {
                return Some(LineHit {
                    t,
                    uv: (u, v),
                    point: Point3::new(p.x(), p.y(), p.z()),
                    grazing: det.abs() <= 1e-3 * size,
                });
            }
            if det.abs() <= 1e-12 * size {
                return None;
            }
            // Solve su du + sv dv - dir dt = -r.
            let rhs = -r;
            u += rhs.dot(sv.cross(back)) / det;
            v += su.dot(rhs.cross(back)) / det;
            t += su.dot(sv.cross(rhs)) / det;
            if u < u_win.0 || u > u_win.1 || v < v_win.0 || v > v_win.1 {
                return None;
            }
        }
        None
    }
}

/// Gauss-Newton for the point of `surface` nearest `p` from `start`, kept
/// within the parameter window `(u_win, v_win)`, as `(u, v, distance)`.
fn closest_from(
    surface: &NurbsSurface,
    p: Point3,
    start: (f64, f64),
    u_win: Interval,
    v_win: Interval,
) -> (f64, f64, f64) {
    const MAX_ITER: usize = 30;
    let (mut u, mut v) = start;
    let gap = |u: f64, v: f64| (surface.evaluate(u, v) - p).length();
    for _ in 0..MAX_ITER {
        let ders = surface.derivatives(u, v, 1);
        let s = ders[0][0];
        let r = Vec3::new(s.x() - p.x(), s.y() - p.y(), s.z() - p.z());
        let (su, sv) = (ders[1][0], ders[0][1]);
        let (a11, a12, a22) = (su.dot(su), su.dot(sv), sv.dot(sv));
        let (b1, b2) = (-su.dot(r), -sv.dot(r));
        let det = a11.mul_add(a22, -(a12 * a12));
        if det.abs() <= 1e-300 {
            break;
        }
        let du = b1.mul_add(a22, -(b2 * a12)) / det;
        let dv = a11.mul_add(b2, -(a12 * b1)) / det;
        let (nu, nv) = (
            (u + du).clamp(u_win.0, u_win.1),
            (v + dv).clamp(v_win.0, v_win.1),
        );
        let moved = (nu - u).abs() + (nv - v).abs();
        (u, v) = (nu, nv);
        if moved <= 1e-15 * (1.0 + u.abs() + v.abs()) {
            break;
        }
    }
    (u, v, gap(u, v))
}

#[cfg(test)]
mod tests {
    #![allow(clippy::unwrap_used, clippy::expect_used)]

    use super::*;

    /// A bicubic patch over [0, 3]^2 bulging up in its middle, split into
    /// three knot spans each way.
    fn bump() -> NurbsSurface {
        let n = 6;
        let cps: Vec<Vec<Point3>> = (0..n)
            .map(|i| {
                (0..n)
                    .map(|j| {
                        let (x, y) = (i as f64 * 0.6, j as f64 * 0.6);
                        let z = if (1..n - 1).contains(&i) && (1..n - 1).contains(&j) {
                            1.0
                        } else {
                            0.0
                        };
                        Point3::new(x, y, z)
                    })
                    .collect()
            })
            .collect();
        let knots = vec![0.0, 0.0, 0.0, 0.0, 1.0, 2.0, 3.0, 3.0, 3.0, 3.0];
        NurbsSurface::new(3, 3, knots.clone(), knots, cps, vec![vec![1.0; n]; n]).unwrap()
    }

    #[test]
    fn vertical_line_meets_the_bump_once() {
        let s = bump();
        let index = SpanIndex::new(&s).unwrap();
        let hits = index.line_hits(&s, Point3::new(1.5, 1.5, -5.0), Vec3::new(0.0, 0.0, 1.0));
        assert_eq!(hits.len(), 1, "{hits:?}");
        let h = hits[0];
        assert!((h.point - s.evaluate(h.uv.0, h.uv.1)).length() < 1e-9);
        assert!((h.point.x() - 1.5).abs() < 1e-9 && (h.point.y() - 1.5).abs() < 1e-9);
        assert!(!h.grazing);
    }

    #[test]
    fn a_hit_on_a_span_edge_counts_once() {
        let s = bump();
        let index = SpanIndex::new(&s).unwrap();
        // u = 1 is an interior knot; find its x at v = 1.5 and shoot there.
        let p = s.evaluate(1.0, 1.5);
        let hits = index.line_hits(
            &s,
            Point3::new(p.x(), p.y(), -5.0),
            Vec3::new(0.0, 0.0, 1.0),
        );
        assert_eq!(hits.len(), 1, "{hits:?}");
    }

    #[test]
    fn horizontal_line_through_the_bump_meets_it_twice() {
        let s = bump();
        let index = SpanIndex::new(&s).unwrap();
        let top = s.evaluate(1.5, 1.5).z();
        let hits = index.line_hits(
            &s,
            Point3::new(-1.0, 1.5, 0.5 * top),
            Vec3::new(1.0, 0.0, 0.0),
        );
        assert_eq!(hits.len(), 2, "{hits:?}");
    }

    #[test]
    fn closest_point_finds_a_point_on_the_patch() {
        let s = bump();
        let index = SpanIndex::new(&s).unwrap();
        for &(u, v) in &[(0.3, 2.7), (1.5, 1.5), (2.0, 0.0), (1.0, 1.0)] {
            let q = s.evaluate(u, v);
            let (pu, pv, d) = index.closest_point(&s, q).unwrap();
            assert!(d < 1e-9, "({u}, {v}) projected {d} off");
            assert!((s.evaluate(pu, pv) - q).length() < 1e-9);
            let (_, _, dn) = SpanIndex::closest_point_near(&s, q, (u + 0.05, v - 0.05));
            assert!(dn < 1e-9, "({u}, {v}) projected {dn} off from nearby");
        }
    }

    #[test]
    fn line_beside_the_patch_misses() {
        let s = bump();
        let index = SpanIndex::new(&s).unwrap();
        let hits = index.line_hits(&s, Point3::new(5.0, 5.0, -5.0), Vec3::new(0.0, 0.0, 1.0));
        assert!(hits.is_empty(), "{hits:?}");
    }
}
