//! Two solids pressed together over a face and also meeting along a line
//! beside it: a bar resting edge on edge on another bar, whose end rises
//! into a block the first bar's end presses against. The union is one
//! piece whose surface touches itself along the line, its four faces there
//! filling two opposite wedges round it. The exact result had that edge
//! used four times and was refused for the mesh fallback; with each wedge
//! taking its own copy of the edge (and of its end vertex, where the two
//! bars' ends meet at a point), the fuse is exact and valid.
#![allow(clippy::unwrap_used, clippy::expect_used)]

use brepkit_math::mat::Mat4;
use brepkit_operations::boolean::{BooleanOp, boolean, mesh_fallback_count};
use brepkit_operations::measure::solid_volume;
use brepkit_operations::primitives::make_box;
use brepkit_operations::tessellate::{
    boundary_edge_count, is_watertight, non_manifold_edge_count, tessellate_solid,
};
use brepkit_operations::transform::transform_solid;
use brepkit_operations::validate::validate_solid;
use brepkit_topology::Topology;
use brepkit_topology::solid::SolidId;

fn placed_box(topo: &mut Topology, lo: [f64; 3], hi: [f64; 3], pose: &Mat4) -> SolidId {
    let b = make_box(topo, hi[0] - lo[0], hi[1] - lo[1], hi[2] - lo[2]).unwrap();
    transform_solid(topo, b, &Mat4::translation(lo[0], lo[1], lo[2])).unwrap();
    transform_solid(topo, b, pose).unwrap();
    b
}

#[test]
fn bars_meeting_along_a_line_beside_a_face_contact_fuse_exactly() {
    let poses = [
        Mat4::identity(),
        Mat4::rotation_z(0.7) * Mat4::rotation_x(0.3),
        Mat4::translation(-40.0, 25.0, 3.0) * Mat4::rotation_y(2.1),
    ];
    for (p, pose) in poses.iter().enumerate() {
        for swap in [false, true] {
            let mut topo = Topology::new();
            let upper = placed_box(&mut topo, [0.0, 5.0, 5.0], [10.0, 10.0, 10.0], pose);
            let lower = placed_box(&mut topo, [0.0, 0.0, 0.0], [10.0, 5.0, 5.0], pose);
            let block = placed_box(&mut topo, [10.0, 0.0, 0.0], [12.0, 10.0, 10.0], pose);
            let ell = boolean(&mut topo, BooleanOp::Fuse, lower, block).unwrap();
            let (a, b) = if swap { (ell, upper) } else { (upper, ell) };

            let before = mesh_fallback_count();
            let fused = boolean(&mut topo, BooleanOp::Fuse, a, b).unwrap();
            assert_eq!(
                mesh_fallback_count(),
                before,
                "pose {p}, swap {swap}: mesh fallback"
            );
            let report = validate_solid(&topo, fused).unwrap();
            assert!(
                report.is_valid(),
                "pose {p}, swap {swap}: {:?}",
                report.issues
            );
            let volume = solid_volume(&topo, fused, 0.001).unwrap();
            assert!(
                (volume - 700.0).abs() < 1e-6 * 700.0,
                "pose {p}, swap {swap}: volume {volume}, want 700"
            );
            let mesh = tessellate_solid(&topo, fused, 0.01).unwrap();
            // The mesh welds by position, so the pinch line is one mesh
            // edge with four triangles on it; nothing else may be open.
            assert_eq!(
                boundary_edge_count(&mesh),
                0,
                "pose {p}, swap {swap}: open mesh"
            );
            assert!(
                non_manifold_edge_count(&mesh) <= 1,
                "pose {p}, swap {swap}: mesh edges past the pinch"
            );
        }
    }
}

#[test]
fn rod_lying_on_a_plate_into_a_block_fuses_exactly() {
    use brepkit_operations::primitives::make_cylinder;
    let poses = [
        Mat4::identity(),
        Mat4::rotation_z(0.7) * Mat4::rotation_x(0.3),
        Mat4::translation(-40.0, 25.0, 3.0) * Mat4::rotation_y(2.1),
    ];
    let want = 2.0f64.mul_add(6.0 * 4.0, 20.0 * 10.0 * 2.0) + std::f64::consts::PI * 10.0;
    for (p, pose) in poses.iter().enumerate() {
        for turn in [0.0, 1.3, 3.0] {
            let mut topo = Topology::new();
            let plate = placed_box(&mut topo, [-5.0, -5.0, -2.0], [15.0, 5.0, 0.0], pose);
            let block = placed_box(&mut topo, [10.0, -3.0, 0.0], [12.0, 3.0, 4.0], pose);
            let rod = make_cylinder(&mut topo, 1.0, 10.0).unwrap();
            let lay = Mat4::translation(0.0, 0.0, 1.0)
                * Mat4::rotation_y(std::f64::consts::FRAC_PI_2)
                * Mat4::rotation_z(turn);
            transform_solid(&mut topo, rod, &lay).unwrap();
            transform_solid(&mut topo, rod, pose).unwrap();
            let base = boolean(&mut topo, BooleanOp::Fuse, plate, block).unwrap();

            let before = mesh_fallback_count();
            let fused = boolean(&mut topo, BooleanOp::Fuse, base, rod).unwrap();
            assert_eq!(
                mesh_fallback_count(),
                before,
                "pose {p}, turn {turn}: mesh fallback"
            );
            let report = validate_solid(&topo, fused).unwrap();
            assert!(
                report.is_valid(),
                "pose {p}, turn {turn}: {:?}",
                report.issues
            );
            let volume = solid_volume(&topo, fused, 0.001).unwrap();
            assert!(
                (volume - want).abs() < 1e-6 * want,
                "pose {p}, turn {turn}: volume {volume}, want {want}"
            );
            let mesh = tessellate_solid(&topo, fused, 0.01).unwrap();
            assert!(is_watertight(&mesh), "pose {p}, turn {turn}: open mesh");
        }
    }
}
