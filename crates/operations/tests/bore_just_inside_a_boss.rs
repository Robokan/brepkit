//! A bore cut through a plate, the boss fused to its back and a flange on
//! the boss's end, the bore tilted 2.3° off the boss's axis and running just
//! inside its wall. Where the bore crosses the plate's back face and the
//! flange's shoulder it lies wholly inside the boss's round hole in them, so
//! neither face holds a section. Their outlines and boxes do hold it, and
//! the section was kept: it split the bore's wall along a curve no face
//! shared, the wall was dropped, and the cut fell back to a mesh. The cut is
//! exact, valid and at its closed-form volume.
#![allow(clippy::unwrap_used, clippy::expect_used)]

use std::f64::consts::PI;

use brepkit_math::mat::Mat4;
use brepkit_math::vec::Vec3;
use brepkit_operations::boolean::{BooleanOp, boolean, mesh_fallback_count};
use brepkit_operations::measure::solid_volume;
use brepkit_operations::primitives::{make_box, make_cylinder};
use brepkit_operations::transform::transform_solid;
use brepkit_operations::validate::validate_solid;
use brepkit_topology::Topology;
use brepkit_topology::solid::SolidId;

const BOSS_R: f64 = 7.75;
const FLANGE_R: f64 = 12.0;
const BORE_R: f64 = 7.2;

/// A cylinder along x from `x0` to `x1`, its seam turned by `spin` degrees.
fn along_x(topo: &mut Topology, r: f64, x0: f64, x1: f64, spin: f64) -> SolidId {
    let c = make_cylinder(topo, r, x1 - x0).unwrap();
    let m = Mat4::translation(x1, 0.0, 0.0)
        * Mat4::rotation_y(-90.0_f64.to_radians())
        * Mat4::rotation_z(spin.to_radians());
    transform_solid(topo, c, &m).unwrap();
    c
}

#[test]
fn a_bore_just_inside_a_boss_keeps_its_wall() {
    // flange x 0..4, boss x 4..28, plate x 22..34
    let d = Vec3::new(-1.0, 0.0405, 0.0157).normalize().unwrap();
    for spin in [0.0, 90.0, 180.0, 270.0] {
        let mut topo = Topology::new();
        let plate = make_box(&mut topo, 12.0, 40.0, 40.0).unwrap();
        transform_solid(&mut topo, plate, &Mat4::translation(22.0, -20.0, -20.0)).unwrap();
        let boss = along_x(&mut topo, BOSS_R, 4.0, 28.0, 0.0);
        let flange = along_x(&mut topo, FLANGE_R, 0.0, 4.0, 0.0);
        let mut part = boolean(&mut topo, BooleanOp::Fuse, plate, boss).unwrap();
        part = boolean(&mut topo, BooleanOp::Fuse, part, flange).unwrap();

        let bore = make_cylinder(&mut topo, BORE_R, 37.0).unwrap();
        let place = Mat4::translation(35.25, -0.85, -0.33)
            * Mat4::rotation_z(d.y().atan2(d.x()))
            * Mat4::rotation_y(d.z().acos())
            * Mat4::rotation_z(f64::to_radians(spin));
        transform_solid(&mut topo, bore, &place).unwrap();

        let before = mesh_fallback_count();
        let cut = boolean(&mut topo, BooleanOp::Cut, part, bore).unwrap();
        assert_eq!(
            mesh_fallback_count(),
            before,
            "bore spin {spin}: mesh fallback"
        );
        let report = validate_solid(&topo, cut).unwrap();
        assert!(report.is_valid(), "bore spin {spin}: {:?}", report.issues);
        let solid =
            12.0 * 40.0 * 40.0 + PI * BOSS_R * BOSS_R * 18.0 + PI * FLANGE_R * FLANGE_R * 4.0;
        let want = solid - PI * BORE_R * BORE_R * 34.0 / d.x().abs();
        let volume = solid_volume(&topo, cut, 0.001).unwrap();
        assert!(
            (volume - want).abs() < 1e-6 * want,
            "bore spin {spin}: volume {volume}, want {want}"
        );
    }
}
