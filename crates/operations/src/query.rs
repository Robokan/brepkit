//! Shape query utilities.

use std::collections::{HashMap, HashSet};

use brepkit_topology::Topology;
use brepkit_topology::edge::EdgeId;
use brepkit_topology::face::{FaceId, FaceSurface};
use brepkit_topology::solid::SolidId;

use crate::OperationsError;

/// Filter edges to only those shared by two planar faces in a solid.
///
/// Given a solid and a set of edge IDs, returns only the edges
/// where both adjacent faces have a planar surface.
///
/// # Errors
///
/// Returns `OperationsError::Topology` if any entity ID is invalid.
pub fn filter_planar_edges(
    topo: &Topology,
    solid_id: SolidId,
    edge_ids: &[EdgeId],
) -> Result<Vec<EdgeId>, OperationsError> {
    let solid_data = topo.solid(solid_id)?;
    let shell = topo.shell(solid_data.outer_shell())?;

    let mut edge_faces: HashMap<usize, Vec<FaceId>> = HashMap::new();
    for &fid in shell.faces() {
        let face = topo.face(fid)?;
        let wire = topo.wire(face.outer_wire())?;
        for oe in wire.edges() {
            edge_faces.entry(oe.edge().index()).or_default().push(fid);
        }
    }

    let mut result = Vec::new();
    for &eid in edge_ids {
        if let Some(adj_faces) = edge_faces.get(&eid.index()) {
            let all_planar = adj_faces.iter().all(|&fid| {
                topo.face(fid)
                    .map(|f| matches!(f.surface(), FaceSurface::Plane { .. }))
                    .unwrap_or(false)
            });
            if all_planar {
                result.push(eid);
            }
        }
    }
    Ok(result)
}

/// Filter edges to only those the blend engine can fillet: manifold edges
/// (shared by exactly two distinct faces) that meet at a real (non-tangent)
/// angle.
///
/// Edges bordering a curved neighbour — including a previous fillet's NURBS
/// blend face — ARE filletable: the corrected [`brepkit_blend::fillet_builder::FilletBuilder`]
/// solves the true ball-tangent contacts against analytic and NURBS surfaces.
/// The cases that genuinely have no fillet are **tangent / G1** edges (the two
/// faces meet smoothly, e.g. a fillet face's contact line with its planar
/// neighbour) and degenerate folds; those are excluded here so callers never
/// feed them to the engine.
///
/// Production dispatch additionally validates complete edge accounting and
/// the assembled solid before publication.
///
/// # Errors
///
/// Returns `OperationsError::Topology` if any entity ID is invalid.
pub fn filter_filletable_edges(
    topo: &Topology,
    solid_id: SolidId,
    edge_ids: &[EdgeId],
) -> Result<Vec<EdgeId>, OperationsError> {
    let solid_data = topo.solid(solid_id)?;
    let shell = topo.shell(solid_data.outer_shell())?;

    // Map each edge to its set of *distinct* adjacent faces, walking both outer
    // and inner (hole-boundary) wires — the same adjacency the fillet engine
    // sees. The set dedups a seam edge that a single face's wire lists twice.
    let mut edge_faces: HashMap<usize, HashSet<FaceId>> = HashMap::new();
    for &fid in shell.faces() {
        let face = topo.face(fid)?;
        let mut wires = vec![face.outer_wire()];
        wires.extend(face.inner_wires().iter().copied());
        for wid in wires {
            for oe in topo.wire(wid)?.edges() {
                edge_faces.entry(oe.edge().index()).or_default().insert(fid);
            }
        }
    }

    let mut result = Vec::new();
    for &eid in edge_ids {
        let Some(adj_faces) = edge_faces.get(&eid.index()) else {
            continue;
        };
        if adj_faces.len() != 2 {
            continue;
        }
        if edge_is_tangent(topo, eid, adj_faces)? {
            continue;
        }
        result.push(eid);
    }
    Ok(result)
}

/// Whether the two faces of `eid` meet tangentially (G1) — their effective
/// outward normals are (anti)parallel at the edge midpoint, so there is no
/// real dihedral to round. Returns `true` for the degenerate cases the fillet
/// engine cannot blend.
fn edge_is_tangent(
    topo: &Topology,
    eid: EdgeId,
    faces: &HashSet<FaceId>,
) -> Result<bool, OperationsError> {
    let mut it = faces.iter().copied();
    let (Some(f1), Some(f2)) = (it.next(), it.next()) else {
        return Ok(true);
    };
    let edge = topo.edge(eid)?;
    let a = topo.vertex(edge.start())?.point();
    let b = topo.vertex(edge.end())?.point();
    let mid = a + (b - a) * 0.5;

    let normal = |fid: FaceId| -> Option<brepkit_math::vec::Vec3> {
        let face = topo.face(fid).ok()?;
        let n = match face.surface() {
            FaceSurface::Plane { normal, .. } => *normal,
            other => {
                let (u, v) = other.project_point(mid)?;
                other.normal(u, v)
            }
        };
        let n = if face.is_reversed() { -n } else { n };
        n.normalize().ok()
    };

    match (normal(f1), normal(f2)) {
        (Some(n1), Some(n2)) => {
            let cos = n1.dot(n2).clamp(-1.0, 1.0);
            // Tangent within ~5°: |angle| < 5° (cos > 0.9962) or > 175°.
            Ok(cos.abs() > 0.9962)
        }
        // Can't determine a normal — don't exclude; the engine + manifold guard
        // will decide.
        _ => Ok(false),
    }
}

/// The edges a round of `edges` runs along: each picked edge, and every
/// edge that runs on from one tangent to it, as some kernels round a picked
/// edge along its whole smooth chain.
///
/// An edge runs on from a chain edge at their shared vertex when it leaves
/// that vertex the opposite way, within `angle` radians, shares a face with
/// it, has two faces meeting at a crease (not a smooth edge, which has no
/// round), and is the only such edge there. The result keeps the picks in
/// their order, followed by the edges added.
///
/// # Errors
///
/// Returns `OperationsError::Topology` if any entity ID is invalid.
pub fn tangent_chain(
    topo: &Topology,
    solid_id: SolidId,
    edges: &[EdgeId],
    angle: f64,
) -> Result<Vec<EdgeId>, OperationsError> {
    use brepkit_math::vec::Vec3;
    use brepkit_topology::vertex::VertexId;

    let mut edge_faces: HashMap<EdgeId, HashSet<FaceId>> = HashMap::new();
    for fid in brepkit_topology::explorer::solid_faces(topo, solid_id)? {
        let face = topo.face(fid)?;
        for wid in std::iter::once(face.outer_wire()).chain(face.inner_wires().iter().copied()) {
            for oe in topo.wire(wid)?.edges() {
                edge_faces.entry(oe.edge()).or_default().insert(fid);
            }
        }
    }
    let mut vertex_edges: HashMap<VertexId, Vec<EdgeId>> = HashMap::new();
    for &edge_id in edge_faces.keys() {
        let edge = topo.edge(edge_id)?;
        for v in [edge.start(), edge.end()] {
            let at = vertex_edges.entry(v).or_default();
            if !at.contains(&edge_id) {
                at.push(edge_id);
            }
        }
    }
    // The way an edge leaves each of its ends: its curve's tangent there,
    // turned to point along the edge (whatever its curve's
    // parameterisation), as a short step along it shows.
    let leaving = |edge_id: EdgeId| -> Result<[(VertexId, Vec3); 2], OperationsError> {
        let edge = topo.edge(edge_id)?;
        let (a, b) = (
            topo.vertex(edge.start())?.point(),
            topo.vertex(edge.end())?.point(),
        );
        let (t0, t1) = edge.curve().domain_with_endpoints(a, b);
        let step = 1e-3 * (t1 - t0);
        let at = |t: f64, inward: Vec3| {
            let tangent = edge.curve().tangent_with_endpoints(t, a, b);
            let tangent = tangent.normalize().unwrap_or(inward);
            if tangent.dot(inward) < 0.0 {
                -tangent
            } else {
                tangent
            }
        };
        Ok([
            (
                edge.start(),
                at(
                    t0,
                    edge.curve().evaluate_with_endpoints(t0 + step, a, b) - a,
                ),
            ),
            (
                edge.end(),
                at(
                    t1,
                    edge.curve().evaluate_with_endpoints(t1 - step, a, b) - b,
                ),
            ),
        ])
    };
    let opposite = -angle.cos();
    let mut chain: Vec<EdgeId> = edges.to_vec();
    let mut queue: Vec<EdgeId> = edges.to_vec();
    while let Some(edge_id) = queue.pop() {
        let Some(faces) = edge_faces.get(&edge_id) else {
            continue;
        };
        let faces = faces.clone();
        for (vertex, out) in leaving(edge_id)? {
            let mut runs_on = Vec::new();
            for &other in vertex_edges.get(&vertex).map_or(&[][..], Vec::as_slice) {
                if other == edge_id {
                    continue;
                }
                let Some(other_faces) = edge_faces.get(&other) else {
                    continue;
                };
                if other_faces.len() != 2 || other_faces.is_disjoint(&faces) {
                    continue;
                }
                let tangent = leaving(other)?
                    .iter()
                    .any(|&(v, dir)| v == vertex && dir.dot(out) <= opposite);
                if tangent && !edge_is_tangent(topo, other, other_faces)? {
                    runs_on.push(other);
                }
            }
            if let [next] = runs_on.as_slice()
                && !chain.contains(next)
            {
                chain.push(*next);
                queue.push(*next);
            }
        }
    }
    Ok(chain)
}

#[cfg(test)]
mod tests {
    #![allow(clippy::unwrap_used, clippy::expect_used, deprecated)]

    use brepkit_topology::explorer::solid_edges;

    use super::*;

    /// A stadium plate (two lines and two half circles, extruded): a picked
    /// top line runs on round the whole top outline, tangent at each join;
    /// the vertical edges, where a flat side meets a round end smoothly, are
    /// left out, and so is the bottom.
    #[test]
    fn tangent_chain_runs_round_a_stadium_outline() {
        use brepkit_math::curves::Circle3D;
        use brepkit_math::vec::{Point3, Vec3};
        use brepkit_topology::edge::{Edge, EdgeCurve};
        use brepkit_topology::face::Face;
        use brepkit_topology::vertex::Vertex;
        use brepkit_topology::wire::{OrientedEdge, Wire};

        let (length, radius, height) = (6.0, 2.0, 1.0);
        let mut topo = Topology::new();
        let z = Vec3::new(0.0, 0.0, 1.0);
        let corners = [
            (0.0, -radius),
            (length, -radius),
            (length, radius),
            (0.0, radius),
        ]
        .map(|(x, y)| topo.add_vertex(Vertex::new(Point3::new(x, y, 0.0), 1e-7)));
        let arc =
            |x: f64| EdgeCurve::Circle(Circle3D::new(Point3::new(x, 0.0, 0.0), z, radius).unwrap());
        let edges = [
            Edge::new(corners[0], corners[1], EdgeCurve::Line),
            Edge::new(corners[1], corners[2], arc(length)),
            Edge::new(corners[2], corners[3], EdgeCurve::Line),
            Edge::new(corners[3], corners[0], arc(0.0)),
        ]
        .map(|edge| OrientedEdge::new(topo.add_edge(edge), true));
        let wire = topo.add_wire(Wire::new(edges.to_vec(), true).unwrap());
        let face = topo.add_face(Face::new(
            wire,
            vec![],
            FaceSurface::Plane { normal: z, d: 0.0 },
        ));
        let solid = crate::extrude::extrude(&mut topo, face, z, height).unwrap();

        let at_height = |edge: EdgeId, h: f64| {
            let edge = topo.edge(edge).unwrap();
            [edge.start(), edge.end()]
                .iter()
                .all(|&v| (topo.vertex(v).unwrap().point().z() - h).abs() < 1e-9)
        };
        let all = solid_edges(&topo, solid).unwrap();
        let top_line = all
            .iter()
            .copied()
            .find(|&e| {
                at_height(e, height) && matches!(topo.edge(e).unwrap().curve(), EdgeCurve::Line)
            })
            .unwrap();
        let chain = tangent_chain(&topo, solid, &[top_line], 1e-3).unwrap();
        assert_eq!(chain[0], top_line, "the pick comes first");
        let mut top: Vec<EdgeId> = all
            .iter()
            .copied()
            .filter(|&e| at_height(e, height))
            .collect();
        let mut got = chain;
        top.sort_unstable_by_key(|e| e.index());
        got.sort_unstable_by_key(|e| e.index());
        assert_eq!(got, top, "the whole top outline, and nothing else");

        // A box's edge meets its neighbours square: it stays alone.
        let boxed = crate::primitives::make_box(&mut topo, 1.0, 2.0, 3.0).unwrap();
        let edge = solid_edges(&topo, boxed).unwrap()[0];
        assert_eq!(
            tangent_chain(&topo, boxed, &[edge], 1e-3).unwrap(),
            vec![edge]
        );
    }

    #[test]
    fn filletable_edges_all_planar_box() {
        let mut topo = Topology::new();
        let cube = crate::primitives::make_box(&mut topo, 10.0, 10.0, 10.0).unwrap();
        let edges = solid_edges(&topo, cube).unwrap();
        let filletable = filter_filletable_edges(&topo, cube, &edges).unwrap();
        assert_eq!(
            filletable.len(),
            edges.len(),
            "every box edge is plane↔plane and filletable"
        );
        assert_eq!(edges.len(), 12);
    }

    #[test]
    fn filletable_edges_keep_nontangent_blend_edges_drop_tangent() {
        // A single rolling-ball fillet makes a watertight solid with a NURBS
        // blend face. Its NURBS-blend-border edges split into tangent/G1 contact
        // lines (degenerate → excluded) and real-angle end-caps (→ kept).
        let mut topo = Topology::new();
        let cube = crate::primitives::make_box(&mut topo, 10.0, 10.0, 10.0).unwrap();
        let edges = solid_edges(&topo, cube).unwrap();
        let filleted =
            crate::fillet::fillet_rolling_ball(&mut topo, cube, &[edges[0]], 1.0).unwrap();
        let r_edges = solid_edges(&topo, filleted).unwrap();
        let filletable: HashSet<usize> = filter_filletable_edges(&topo, filleted, &r_edges)
            .unwrap()
            .iter()
            .map(|e| e.index())
            .collect();

        let sh = topo
            .shell(topo.solid(filleted).unwrap().outer_shell())
            .unwrap();
        // The blend face, whatever surface type it carries. A straight box
        // edge blends to an exact cylinder; only curved neighbours give NURBS.
        let blend_faces: HashSet<usize> = sh
            .faces()
            .iter()
            .filter(|&&f| !topo.face(f).unwrap().surface().is_planar())
            .map(|f| f.index())
            .collect();
        assert!(
            !blend_faces.is_empty(),
            "first fillet must create a blend face"
        );

        let mut ef: HashMap<usize, HashSet<FaceId>> = HashMap::new();
        for &fid in sh.faces() {
            for oe in topo
                .wire(topo.face(fid).unwrap().outer_wire())
                .unwrap()
                .edges()
            {
                ef.entry(oe.edge().index()).or_default().insert(fid);
            }
        }

        let (mut saw_kept, mut saw_dropped_tangent) = (false, false);
        for &e in &r_edges {
            let Some(fs) = ef.get(&e.index()) else {
                continue;
            };
            if fs.len() != 2 || !fs.iter().any(|f| blend_faces.contains(&f.index())) {
                continue;
            }
            if edge_is_tangent(&topo, e, fs).unwrap() {
                assert!(
                    !filletable.contains(&e.index()),
                    "tangent blend-contact edge {} must be excluded",
                    e.index()
                );
                saw_dropped_tangent = true;
            } else {
                assert!(
                    filletable.contains(&e.index()),
                    "non-tangent blend-adjacent edge {} must stay filletable",
                    e.index()
                );
                saw_kept = true;
            }
        }
        assert!(saw_kept, "expected a kept non-tangent NURBS-blend edge");
        assert!(
            saw_dropped_tangent,
            "expected an excluded tangent contact edge"
        );
    }
}
