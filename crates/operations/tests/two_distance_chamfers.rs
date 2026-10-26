//! Two-distance chamfers with a reference face per edge: `d1` on that face,
//! `d2` on the edge's other face (a distance-and-angle chamfer is
//! `d2 = d1 * tan(angle)`). A straight edge of a drilled plate goes to the
//! blend engine, which must keep the trimmed face's hole; a hole's round
//! rim is a countersink, a cone from the cap to the wall.
#![allow(clippy::unwrap_used, clippy::expect_used)]

use std::f64::consts::PI;

use brepkit_math::mat::Mat4;
use brepkit_math::vec::Point3;
use brepkit_operations::boolean::{BooleanOp, boolean};
use brepkit_operations::chamfer::chamfer_two_on;
use brepkit_operations::measure::solid_volume;
use brepkit_operations::primitives::{make_box, make_cylinder};
use brepkit_operations::transform::transform_solid;
use brepkit_operations::validate::validate_solid;
use brepkit_topology::Topology;
use brepkit_topology::edge::{EdgeCurve, EdgeId};
use brepkit_topology::face::{FaceId, FaceSurface};
use brepkit_topology::solid::SolidId;

/// A 40 x 20 x 10 plate, z from 0 to 10, drilled through at (10, 10) with
/// radius 3.
fn drilled_plate(topo: &mut Topology) -> SolidId {
    let plate = make_box(topo, 40.0, 20.0, 10.0).unwrap();
    let drill = make_cylinder(topo, 3.0, 14.0).unwrap();
    transform_solid(topo, drill, &Mat4::translation(10.0, 10.0, -2.0)).unwrap();
    boolean(topo, BooleanOp::Cut, plate, drill).unwrap()
}

/// The edge of `solid` whose ends are `a` and `b`, either way round.
fn edge_between(topo: &Topology, solid: SolidId, a: Point3, b: Point3) -> EdgeId {
    brepkit_topology::explorer::solid_edges(topo, solid)
        .unwrap()
        .into_iter()
        .find(|&e| {
            let edge = topo.edge(e).unwrap();
            let p = topo.vertex(edge.start()).unwrap().point();
            let q = topo.vertex(edge.end()).unwrap().point();
            ((p - a).length() < 1e-9 && (q - b).length() < 1e-9)
                || ((p - b).length() < 1e-9 && (q - a).length() < 1e-9)
        })
        .unwrap()
}

/// The face of `solid` along `edge` that is a plane with outward normal `n`.
fn plane_along(topo: &Topology, solid: SolidId, edge: EdgeId, n: [f64; 3]) -> FaceId {
    let adjacency = topo.build_adjacency(solid).unwrap();
    *adjacency
        .faces_for_edge(edge)
        .iter()
        .find(|&&f| {
            matches!(topo.face(f).unwrap().surface(), FaceSurface::Plane { normal, .. }
                if (normal.x() - n[0]).abs() + (normal.y() - n[1]).abs() + (normal.z() - n[2]).abs() < 1e-9)
        })
        .unwrap()
}

/// The highest y of any vertex on the plate's top face (z = 10) after the
/// chamfer: how far the bevel set the top back from the edge at y = 20.
fn top_reach(topo: &Topology, solid: SolidId) -> f64 {
    let mut reach = f64::NEG_INFINITY;
    for f in brepkit_topology::explorer::solid_faces(topo, solid).unwrap() {
        let face = topo.face(f).unwrap();
        let FaceSurface::Plane { normal, d } = face.surface() else {
            continue;
        };
        if normal.z() < 1.0 - 1e-9 || (d - 10.0).abs() > 1e-9 {
            continue;
        }
        for oe in topo.wire(face.outer_wire()).unwrap().edges() {
            let p = topo
                .vertex(topo.edge(oe.edge()).unwrap().start())
                .unwrap()
                .point();
            reach = reach.max(p.y());
        }
    }
    reach
}

#[test]
fn a_drilled_plates_edge_chamfers_from_either_face_and_keeps_the_hole() {
    let (d1, d2) = (4.0, 2.0);
    let want = 40.0 * 20.0 * 10.0 - PI * 9.0 * 10.0 - 0.5 * d1 * d2 * 40.0;
    for (normal, reach) in [([0.0, 0.0, 1.0], 20.0 - d1), ([0.0, 1.0, 0.0], 20.0 - d2)] {
        let mut topo = Topology::new();
        let plate = drilled_plate(&mut topo);
        let edge = edge_between(
            &topo,
            plate,
            Point3::new(0.0, 20.0, 10.0),
            Point3::new(40.0, 20.0, 10.0),
        );
        let reference = plane_along(&topo, plate, edge, normal);
        let cut = chamfer_two_on(&mut topo, plate, &[(edge, reference)], d1, d2).unwrap();
        let report = validate_solid(&topo, cut).unwrap();
        assert!(report.is_valid(), "{normal:?}: {:?}", report.issues);
        let volume = solid_volume(&topo, cut, 0.001).unwrap();
        assert!(
            (volume - want).abs() < 1e-6 * want,
            "{normal:?}: volume {volume}, want {want}"
        );
        let got = top_reach(&topo, cut);
        assert!(
            (got - reach).abs() < 1e-9,
            "{normal:?}: top reaches {got}, want {reach}"
        );
    }
}

#[test]
fn a_holes_rim_countersinks_by_two_distances() {
    let (d1, d2) = (2.0, 1.0);
    let mut topo = Topology::new();
    let plate = drilled_plate(&mut topo);
    let rim = brepkit_topology::explorer::solid_edges(&topo, plate)
        .unwrap()
        .into_iter()
        .find(|&e| {
            let edge = topo.edge(e).unwrap();
            matches!(edge.curve(), EdgeCurve::Circle(c) if (c.center().z() - 10.0).abs() < 1e-9)
        })
        .unwrap();
    let cap = plane_along(&topo, plate, rim, [0.0, 0.0, 1.0]);
    let cut = chamfer_two_on(&mut topo, plate, &[(rim, cap)], d1, d2).unwrap();
    let report = validate_solid(&topo, cut).unwrap();
    assert!(report.is_valid(), "{:?}", report.issues);
    // the cone runs from radius 3 + d1 on the cap down d2 to the bore
    let (big, small) = (3.0 + d1, 3.0_f64);
    let sink = PI * d2 * big.mul_add(big, small.mul_add(small, big * small)) / 3.0 - PI * 9.0 * d2;
    let want = 40.0 * 20.0 * 10.0 - PI * 9.0 * 10.0 - sink;
    let volume = solid_volume(&topo, cut, 0.001).unwrap();
    assert!(
        (volume - want).abs() < 1e-6 * want,
        "volume {volume}, want {want}"
    );
}

/// A planar face's loop of corners and its outward normal.
type Loop<'a> = (&'a [(f64, f64, f64)], [f64; 3]);

/// A 200 x 80 x 20 box, x from -100 to 100, y from -40 to 40, z from -20
/// to 0, its four edges along y at the ends left in pieces at y = -36 (as
/// a fuse can leave them): the end faces, top and bottom carry a vertex 4
/// from the front corners.
fn box_with_pieced_ends(topo: &mut Topology) -> SolidId {
    use brepkit_topology::edge::Edge;
    use brepkit_topology::face::Face;
    use brepkit_topology::shell::Shell;
    use brepkit_topology::solid::Solid;
    use brepkit_topology::vertex::Vertex;
    use brepkit_topology::wire::{OrientedEdge, Wire};
    use std::collections::HashMap;

    let mut verts: HashMap<(i64, i64, i64), brepkit_topology::vertex::VertexId> = HashMap::new();
    let mut edges: HashMap<(usize, usize), EdgeId> = HashMap::new();
    let mut faces = Vec::new();
    #[allow(clippy::cast_possible_truncation)]
    let key = |p: (f64, f64, f64)| (p.0.round() as i64, p.1.round() as i64, p.2.round() as i64);
    // Each loop runs counterclockwise about the face's outward normal.
    let loops: [Loop<'_>; 6] = [
        (
            &[
                (-100.0, -40.0, -20.0),
                (-100.0, -36.0, -20.0),
                (-100.0, 40.0, -20.0),
                (100.0, 40.0, -20.0),
                (100.0, -36.0, -20.0),
                (100.0, -40.0, -20.0),
            ],
            [0.0, 0.0, -1.0],
        ),
        (
            &[
                (-100.0, -40.0, 0.0),
                (100.0, -40.0, 0.0),
                (100.0, -36.0, 0.0),
                (100.0, 40.0, 0.0),
                (-100.0, 40.0, 0.0),
                (-100.0, -36.0, 0.0),
            ],
            [0.0, 0.0, 1.0],
        ),
        (
            &[
                (-100.0, -40.0, -20.0),
                (100.0, -40.0, -20.0),
                (100.0, -40.0, 0.0),
                (-100.0, -40.0, 0.0),
            ],
            [0.0, -1.0, 0.0],
        ),
        (
            &[
                (-100.0, 40.0, -20.0),
                (-100.0, 40.0, 0.0),
                (100.0, 40.0, 0.0),
                (100.0, 40.0, -20.0),
            ],
            [0.0, 1.0, 0.0],
        ),
        (
            &[
                (100.0, -40.0, -20.0),
                (100.0, -36.0, -20.0),
                (100.0, 40.0, -20.0),
                (100.0, 40.0, 0.0),
                (100.0, -36.0, 0.0),
                (100.0, -40.0, 0.0),
            ],
            [1.0, 0.0, 0.0],
        ),
        (
            &[
                (-100.0, -40.0, -20.0),
                (-100.0, -40.0, 0.0),
                (-100.0, -36.0, 0.0),
                (-100.0, 40.0, 0.0),
                (-100.0, 40.0, -20.0),
                (-100.0, -36.0, -20.0),
            ],
            [-1.0, 0.0, 0.0],
        ),
    ];
    for (pts, n) in loops {
        let ids: Vec<_> = pts
            .iter()
            .map(|&p| {
                *verts.entry(key(p)).or_insert_with(|| {
                    topo.add_vertex(Vertex::new(Point3::new(p.0, p.1, p.2), 1e-7))
                })
            })
            .collect();
        let mut oriented = Vec::new();
        for i in 0..ids.len() {
            let (a, b) = (ids[i], ids[(i + 1) % ids.len()]);
            let k = (a.index().min(b.index()), a.index().max(b.index()));
            let e = *edges
                .entry(k)
                .or_insert_with(|| topo.add_edge(Edge::new(a, b, EdgeCurve::Line)));
            let forward = topo.edge(e).unwrap().start() == a;
            oriented.push(OrientedEdge::new(e, forward));
        }
        let wire = topo.add_wire(Wire::new(oriented, true).unwrap());
        let normal = brepkit_math::vec::Vec3::new(n[0], n[1], n[2]);
        let d = normal.dot(brepkit_math::vec::Vec3::new(pts[0].0, pts[0].1, pts[0].2));
        faces.push(topo.add_face(Face::new(wire, vec![], FaceSurface::Plane { normal, d })));
    }
    let shell = topo.add_shell(Shell::new(faces).unwrap());
    topo.add_solid(Solid::new(shell, vec![]))
}

/// Both front vertical corners of a box whose end faces' edges are in
/// pieces 4 from them, chamfered 28 along the front and 13 along the ends:
/// the bevel sets back past the piece at the corner, so the top and
/// bottom faces' detour round the corner runs through that piece's vertex
/// too, and the chamfer must close it all the same.
#[test]
fn a_chamfer_past_a_pieced_edge_closes_its_ends() {
    let (d1, d2) = (28.0, 13.0);
    let mut topo = Topology::new();
    let solid = box_with_pieced_ends(&mut topo);
    assert!(validate_solid(&topo, solid).unwrap().is_valid());
    let mut picks = Vec::new();
    for x in [-100.0, 100.0] {
        let edge = edge_between(
            &topo,
            solid,
            Point3::new(x, -40.0, -20.0),
            Point3::new(x, -40.0, 0.0),
        );
        picks.push((edge, plane_along(&topo, solid, edge, [0.0, -1.0, 0.0])));
    }
    let cut = chamfer_two_on(&mut topo, solid, &picks, d1, d2).unwrap();
    let report = validate_solid(&topo, cut).unwrap();
    assert!(report.is_valid(), "{:?}", report.issues);
    let want = 200.0 * 80.0 * 20.0 - 2.0 * 0.5 * d1 * d2 * 20.0;
    let volume = solid_volume(&topo, cut, 0.001).unwrap();
    assert!(
        (volume - want).abs() < 1e-6 * want,
        "volume {volume}, want {want}"
    );
}
