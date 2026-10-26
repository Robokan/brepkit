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
