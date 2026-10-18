//! Plane-NURBS surface intersection.

use crate::MathError;
use crate::aabb::Aabb3;
use crate::nurbs::fitting::interpolate;
use crate::nurbs::projection::project_point_to_curve;
use crate::nurbs::surface::NurbsSurface;
use crate::vec::{Point3, Vec3};

use super::chaining::build_curves_from_chains;
use super::{IntersectionCurve, IntersectionPoint, MAX_NEWTON_ITER};

/// Intersect a plane with a NURBS surface.
///
/// Returns a list of intersection curves (there may be multiple
/// disconnected branches).
///
/// # Parameters
///
/// - `surface`: The NURBS surface
/// - `plane_normal`: Normal of the cutting plane
/// - `plane_d`: Signed distance from origin (`n · p = d` for points on plane)
/// - `samples`: Grid resolution for finding seed points (e.g., 50)
///
/// # Errors
///
/// Returns an error if NURBS evaluation fails or curve fitting fails.
pub fn intersect_plane_nurbs(
    surface: &NurbsSurface,
    plane_normal: Vec3,
    plane_d: f64,
    samples: usize,
) -> Result<Vec<IntersectionCurve>, MathError> {
    intersect_plane_nurbs_in_region(surface, plane_normal, plane_d, samples, None)
}

/// Intersect a plane with a NURBS surface, keeping only the section's runs
/// through `region` (all of it when `None`).
///
/// Each run kept is refined until the curve fitted through it holds to the
/// section within [`SECTION_FIT_TOL`]. The grid scan's pitch is set by the
/// whole surface, so a section through a small face otherwise gets two or
/// three points there (see [`densify_chain`]).
///
/// # Errors
///
/// Returns an error if NURBS evaluation fails or curve fitting fails.
pub fn intersect_plane_nurbs_in_region(
    surface: &NurbsSurface,
    plane_normal: Vec3,
    plane_d: f64,
    samples: usize,
    region: Option<Aabb3>,
) -> Result<Vec<IntersectionCurve>, MathError> {
    let n = samples.max(10);

    // Phase 1: Sample the signed distance field on a grid.
    let mut distances = vec![vec![0.0_f64; n]; n];

    let (u_min, u_max) = surface.domain_u();
    let (v_min, v_max) = surface.domain_v();

    #[allow(clippy::cast_precision_loss)]
    let u_step = (u_max - u_min) / (n - 1) as f64;
    #[allow(clippy::cast_precision_loss)]
    let v_step = (v_max - v_min) / (n - 1) as f64;

    #[allow(clippy::cast_precision_loss)]
    for (i, row) in distances.iter_mut().enumerate() {
        let u = u_min + i as f64 * u_step;
        for (j, dist) in row.iter_mut().enumerate() {
            let v = v_min + j as f64 * v_step;
            let pt = surface.evaluate(u, v);
            let pt_vec = Vec3::new(pt.x(), pt.y(), pt.z());
            *dist = plane_normal.dot(pt_vec) - plane_d;
        }
    }

    // Phase 2: Find zero-crossings on the UNIQUE grid edges (marching
    // squares). Every crossing is computed once and remembers which edge it
    // sits on, so connectivity comes from cell adjacency in phase 3 — not
    // from a distance threshold. Proximity chaining cannot serve this scan:
    // its threshold has no way to tell a sampling gap along one branch from
    // two genuinely-close branches (the kumiko strut end-patch dashes vs the
    // honeycomb thin-wall branches), and each statistic that fixes one side
    // breaks the other. Cell connectivity satisfies both by construction.
    let mut crossings: Vec<(f64, f64)> = Vec::new();
    // Which parameter a crossing on the domain's edge lines must keep: a
    // chain ending there ends ON the patch boundary, where the boundary
    // edge's own crossing with the plane (EE/EF) puts its vertex.
    let mut pinned: Vec<Option<Pin>> = Vec::new();
    // horiz[i][j]: crossing on the edge (i,j)->(i+1,j); vert[i][j]: on
    // (i,j)->(i,j+1).
    let mut horiz = vec![vec![None::<usize>; n]; n - 1];
    let mut vert = vec![vec![None::<usize>; n - 1]; n];

    #[allow(clippy::cast_precision_loss)]
    for i in 0..n {
        for j in 0..n {
            let u0 = u_min + i as f64 * u_step;
            let v0 = v_min + j as f64 * v_step;
            if i + 1 < n {
                let (da, db) = (distances[i][j], distances[i + 1][j]);
                if da * db < 0.0 {
                    let t = da / (da - db);
                    let u = u0.mul_add(1.0 - t, (u0 + u_step) * t);
                    horiz[i][j] = Some(crossings.len());
                    let (v, pin) = match j {
                        0 => (v_min, Some(Pin::V)),
                        _ if j + 1 == n => (v_max, Some(Pin::V)),
                        _ => (v0, None),
                    };
                    crossings.push((u, v));
                    pinned.push(pin);
                }
            }
            if j + 1 < n {
                let (da, db) = (distances[i][j], distances[i][j + 1]);
                if da * db < 0.0 {
                    let t = da / (da - db);
                    let v = v0.mul_add(1.0 - t, (v0 + v_step) * t);
                    vert[i][j] = Some(crossings.len());
                    let (u, pin) = match i {
                        0 => (u_min, Some(Pin::U)),
                        _ if i + 1 == n => (u_max, Some(Pin::U)),
                        _ => (u0, None),
                    };
                    crossings.push((u, v));
                    pinned.push(pin);
                }
            }
        }
    }

    if crossings.is_empty() {
        return Ok(Vec::new());
    }

    // Phase 3: Link crossings through each cell. A cell with two crossing
    // edges connects them; a saddle cell (all four edges crossing) pairs
    // them by the sign of the cell-center sample. Odd counts (a crossing
    // through a grid node) leave that cell unlinked — the chain simply ends
    // there.
    let mut links: Vec<Vec<usize>> = vec![Vec::new(); crossings.len()];
    let connect = |a: usize, b: usize, links: &mut Vec<Vec<usize>>| {
        if !links[a].contains(&b) {
            links[a].push(b);
            links[b].push(a);
        }
    };
    #[allow(clippy::cast_precision_loss)]
    for i in 0..n - 1 {
        for j in 0..n - 1 {
            let bottom = horiz[i][j];
            let top = horiz[i][j + 1];
            let left = vert[i][j];
            let right = vert[i + 1][j];
            let mut present = [0_usize; 4];
            let mut n_present = 0_usize;
            for e in [bottom, top, left, right].into_iter().flatten() {
                present[n_present] = e;
                n_present += 1;
            }
            match n_present {
                2 => connect(present[0], present[1], &mut links),
                4 => {
                    // Saddle: the center sample decides which corners the
                    // curve separates.
                    let uc = u_min + (i as f64 + 0.5) * u_step;
                    let vc = v_min + (j as f64 + 0.5) * v_step;
                    let pc = surface.evaluate(uc, vc);
                    let dc = plane_normal.dot(Vec3::new(pc.x(), pc.y(), pc.z())) - plane_d;
                    let d00 = distances[i][j];
                    let (b, t, l, r) = (
                        bottom.unwrap_or(usize::MAX),
                        top.unwrap_or(usize::MAX),
                        left.unwrap_or(usize::MAX),
                        right.unwrap_or(usize::MAX),
                    );
                    if dc * d00 >= 0.0 {
                        // Center joins the (0,0)/(1,1) corners: the curve
                        // cuts off the other two corners separately.
                        connect(b, r, &mut links);
                        connect(t, l, &mut links);
                    } else {
                        connect(b, l, &mut links);
                        connect(t, r, &mut links);
                    }
                }
                _ => {}
            }
        }
    }

    // Phase 4: Walk the links into ordered chains (open chains from
    // degree-1 endpoints first, then closed loops), Newton-refining each
    // crossing; a refinement failure splits its chain.
    let mut visited = vec![false; crossings.len()];
    let mut ordered_chains: Vec<Vec<IntersectionPoint>> = Vec::new();
    let walk = |start: usize, visited: &mut Vec<bool>| -> Vec<usize> {
        let mut chain = vec![start];
        visited[start] = true;
        let mut current = start;
        while let Some(&next) = links[current].iter().find(|&&x| !visited[x]) {
            visited[next] = true;
            chain.push(next);
            current = next;
        }
        // A loop ends beside its start: close it, or the section loses the
        // stretch between its last crossing and its first.
        if chain.len() > 2 && links[current].contains(&start) {
            chain.push(start);
        }
        chain
    };
    let degree_one: Vec<usize> = (0..crossings.len())
        .filter(|&x| links[x].len() == 1)
        .collect();
    let mut index_chains: Vec<Vec<usize>> = Vec::new();
    for start in degree_one {
        if !visited[start] {
            index_chains.push(walk(start, &mut visited));
        }
    }
    for start in 0..crossings.len() {
        if !visited[start] {
            index_chains.push(walk(start, &mut visited));
        }
    }
    for chain in index_chains {
        let mut current: Vec<IntersectionPoint> = Vec::new();
        for idx in chain {
            let (u_guess, v_guess) = crossings[idx];
            if let Some(refined) = refine_plane_surface_point(
                surface,
                plane_normal,
                plane_d,
                (u_guess, v_guess),
                pinned[idx],
            ) {
                current.push(refined);
            } else if current.len() >= 2 {
                ordered_chains.push(std::mem::take(&mut current));
            } else {
                current.clear();
            }
        }
        if current.len() >= 2 {
            ordered_chains.push(current);
        }
    }

    if ordered_chains.is_empty() {
        return Ok(Vec::new());
    }

    // Phase 5: Fit a curve through each ordered chain.
    let Some(region) = region else {
        return build_curves_from_chains(&ordered_chains);
    };
    let mut curves = Vec::new();
    for chain in &ordered_chains {
        for run in runs_through_region(chain, region) {
            curves.extend(densify_run(surface, plane_normal, plane_d, run, region)?);
        }
    }
    Ok(curves)
}

/// How far a fitted section may stray from the true one between its points,
/// inside the region asked for.
const SECTION_FIT_TOL: f64 = 1e-6;

/// Whether the section between two of its points may pass through
/// `region`: the box of their chord, padded by half the chord (the section
/// may bow out that far), meets it.
fn gap_meets(a: &IntersectionPoint, b: &IntersectionPoint, region: Aabb3) -> bool {
    let pad = 0.5 * (b.point - a.point).length();
    Aabb3::from_points([a.point, b.point])
        .expanded(pad)
        .intersects(region)
}

/// The runs of `chain` through `region`, each with one point beyond it on
/// either side. A closed chain is turned to start in a gap clear of the
/// region, so a run is never cut in two at the chain's seam.
fn runs_through_region(chain: &[IntersectionPoint], region: Aabb3) -> Vec<Vec<IntersectionPoint>> {
    let n = chain.len();
    if n < 2 {
        return Vec::new();
    }
    let closed = (chain[0].point - chain[n - 1].point).length() < 1e-9;
    let mut pts: Vec<IntersectionPoint> = chain.to_vec();
    if closed {
        let gaps = n - 1;
        let clear = |g: usize| !gap_meets(&chain[g], &chain[g + 1], region);
        let Some(g) =
            (0..gaps).find(|&g| clear(g) && clear((g + gaps - 1) % gaps) && clear((g + 1) % gaps))
        else {
            // Every gap is near the region: the whole loop is the run.
            return vec![pts];
        };
        // Start the loop at the far end of the clear gap.
        pts = chain[g + 1..n].to_vec();
        pts.extend_from_slice(&chain[1..=g + 1]);
    }
    let gaps = pts.len() - 1;
    let meets: Vec<bool> = pts
        .windows(2)
        .map(|w| gap_meets(&w[0], &w[1], region))
        .collect();
    let keep: Vec<bool> = (0..gaps)
        .map(|g| meets[g] || (g > 0 && meets[g - 1]) || (g + 1 < gaps && meets[g + 1]))
        .collect();
    let mut runs = Vec::new();
    let mut g = 0;
    while g < gaps {
        if !keep[g] {
            g += 1;
            continue;
        }
        let first = g;
        while g < gaps && keep[g] {
            g += 1;
        }
        runs.push(pts[first..=g].to_vec());
    }
    runs
}

/// Fit a run of the section, refined until the curve interpolating it stays
/// within [`SECTION_FIT_TOL`] of the section inside `region`.
///
/// The grid scan gives one point per grid line crossed, a pitch fixed by
/// the whole surface: on a surface with hundreds of knot spans (a fitted
/// loft) a section through a small face gets two or three points, and the
/// curve fitted through them strays by a tenth of a millimetre between
/// them. Its ends, cut where it crosses that face's edges, then miss the
/// crossings of those edges with the surface, and the sections around the
/// face never close. Each gap through the region whose refined midpoint
/// lies off the fit gets that midpoint. The run is interpolated: an
/// approximating fit strays by more than the tolerance.
fn densify_run(
    surface: &NurbsSurface,
    plane_normal: Vec3,
    plane_d: f64,
    mut run: Vec<IntersectionPoint>,
    region: Aabb3,
) -> Result<Option<IntersectionCurve>, MathError> {
    const MAX_ROUNDS: usize = 10;
    const MAX_POINTS: usize = 200;
    run.dedup_by(|b, a| (a.point - b.point).length() < 1e-9);
    if run.len() < 2 {
        return Ok(None);
    }
    let fit = |run: &[IntersectionPoint]| {
        let positions: Vec<Point3> = run.iter().map(|p| p.point).collect();
        interpolate(&positions, 3)
    };
    let mut curve = fit(&run)?;
    for _ in 0..MAX_ROUNDS {
        let mut denser = Vec::with_capacity(run.len() * 2);
        for w in run.windows(2) {
            denser.push(w[0]);
            let (a, b) = (w[0], w[1]);
            if !gap_meets(&a, &b, region) {
                continue;
            }
            let gap = (b.point - a.point).length();
            let mid = (
                f64::midpoint(a.param1.0, b.param1.0),
                f64::midpoint(a.param1.1, b.param1.1),
            );
            let Some(m) = refine_plane_surface_point(surface, plane_normal, plane_d, mid, None)
            else {
                continue;
            };
            // A refinement that slid off along the surface to another part
            // of the section is no point of this gap.
            let chord_mid = a.point + (b.point - a.point) * 0.5;
            if (m.point - chord_mid).length() > gap
                || (m.point - a.point).length() < 1e-9
                || (m.point - b.point).length() < 1e-9
            {
                continue;
            }
            let off = project_point_to_curve(&curve, m.point, 1e-12)
                .map_or(f64::INFINITY, |proj| proj.distance);
            if off > SECTION_FIT_TOL {
                denser.push(m);
            }
        }
        denser.push(run[run.len() - 1]);
        if denser.len() == run.len() || denser.len() > MAX_POINTS {
            break;
        }
        run = denser;
        curve = fit(&run)?;
    }
    Ok(Some(IntersectionCurve { curve, points: run }))
}

/// The parameter a boundary crossing holds fixed during refinement.
#[derive(Clone, Copy)]
enum Pin {
    U,
    V,
}

/// Refine a plane-surface intersection point using Newton iteration; a
/// pinned parameter stays on its domain edge.
fn refine_plane_surface_point(
    surface: &NurbsSurface,
    plane_normal: Vec3,
    plane_d: f64,
    (u_guess, v_guess): (f64, f64),
    pin: Option<Pin>,
) -> Option<IntersectionPoint> {
    let mut u = u_guess;
    let mut v = v_guess;
    let (u_min, u_max) = surface.domain_u();
    let (v_min, v_max) = surface.domain_v();

    for _ in 0..MAX_NEWTON_ITER {
        let pt = surface.evaluate(u, v);
        let pt_vec = Vec3::new(pt.x(), pt.y(), pt.z());
        let f = plane_normal.dot(pt_vec) - plane_d;

        if f.abs() < 1e-12 {
            return Some(IntersectionPoint {
                point: pt,
                param1: (u, v),
                param2: (0.0, 0.0),
            });
        }

        // Compute gradient of f w.r.t. (u, v).
        let derivs = surface.derivatives(u, v, 1);
        let du = derivs[1][0]; // dS/du
        let dv = derivs[0][1]; // dS/dv

        let grad_u = match pin {
            Some(Pin::U) => 0.0,
            _ => plane_normal.dot(du),
        };
        let grad_v = match pin {
            Some(Pin::V) => 0.0,
            _ => plane_normal.dot(dv),
        };

        let grad_len_sq = grad_u.mul_add(grad_u, grad_v * grad_v);
        if grad_len_sq < 1e-20 {
            break; // Singular.
        }

        // Steepest descent step.
        let step_size = f / grad_len_sq;
        u -= grad_u * step_size;
        v -= grad_v * step_size;

        u = u.clamp(u_min, u_max);
        v = v.clamp(v_min, v_max);
    }

    // Final check.
    let pt = surface.evaluate(u, v);
    let pt_vec = Vec3::new(pt.x(), pt.y(), pt.z());
    let f = plane_normal.dot(pt_vec) - plane_d;

    if f.abs() < 1e-6 {
        Some(IntersectionPoint {
            point: pt,
            param1: (u, v),
            param2: (0.0, 0.0),
        })
    } else {
        None
    }
}
