//! An elliptic cylinder written as some STEP writers write one: its wall a
//! `SURFACE_OF_LINEAR_EXTRUSION` of an `ELLIPSE`, closed by a seam line.
//! The reader took only lines, circles swept along their axis and B-splines
//! as the swept curve, and refused the file.
#![allow(clippy::unwrap_used, clippy::expect_used)]

use brepkit_operations::boolean::{BooleanOp, boolean, mesh_fallback_count};
use brepkit_operations::measure::solid_volume;
use brepkit_operations::tessellate::{is_watertight, tessellate_solid};
use brepkit_operations::validate::validate_solid;
use brepkit_topology::Topology;
use brepkit_topology::explorer::solid_faces;
use std::f64::consts::PI;
use std::fmt::Write;

const A: f64 = 5.0;
const B: f64 = 3.0;

/// One solid's records, numbered from `n`: the elliptic cylinder of semi-axes
/// `A` along x and `B` along y, from z `z0` to `z1`, its seam at (A, 0).
fn solid(n: u64, z0: f64, z1: f64) -> String {
    let r = |k: u64| format!("#{}", n + k);
    let mut out = String::new();
    let mut put = |k: u64, record: String| {
        writeln!(out, "{} = {record};", r(k)).unwrap();
    };
    put(0, format!("MANIFOLD_SOLID_BREP('',{})", r(1)));
    put(1, format!("CLOSED_SHELL('',({},{},{}))", r(2), r(3), r(4)));
    // The wall: bottom rim forward, up the seam, top rim back, down the seam.
    put(2, format!("ADVANCED_FACE('',({}),{},.T.)", r(10), r(40)));
    put(10, format!("FACE_OUTER_BOUND('',{},.T.)", r(11)));
    put(
        11,
        format!("EDGE_LOOP('',({},{},{},{}))", r(12), r(13), r(14), r(15)),
    );
    put(12, format!("ORIENTED_EDGE('',*,*,{},.T.)", r(50)));
    put(13, format!("ORIENTED_EDGE('',*,*,{},.T.)", r(52)));
    put(14, format!("ORIENTED_EDGE('',*,*,{},.F.)", r(51)));
    put(15, format!("ORIENTED_EDGE('',*,*,{},.F.)", r(52)));
    // The bottom cap looks down; its rim runs clockwise seen from above.
    put(3, format!("ADVANCED_FACE('',({}),{},.T.)", r(20), r(42)));
    put(20, format!("FACE_OUTER_BOUND('',{},.T.)", r(21)));
    put(21, format!("EDGE_LOOP('',({}))", r(22)));
    put(22, format!("ORIENTED_EDGE('',*,*,{},.F.)", r(50)));
    put(4, format!("ADVANCED_FACE('',({}),{},.T.)", r(30), r(44)));
    put(30, format!("FACE_OUTER_BOUND('',{},.T.)", r(31)));
    put(31, format!("EDGE_LOOP('',({}))", r(32)));
    put(32, format!("ORIENTED_EDGE('',*,*,{},.T.)", r(51)));
    // Surfaces.
    put(
        40,
        format!("SURFACE_OF_LINEAR_EXTRUSION('',{},{})", r(60), r(41)),
    );
    put(41, format!("VECTOR('',{},1.)", r(80)));
    put(42, format!("PLANE('',{})", r(43)));
    put(
        43,
        format!("AXIS2_PLACEMENT_3D('',{},{},{})", r(70), r(81), r(82)),
    );
    put(44, format!("PLANE('',{})", r(45)));
    put(
        45,
        format!("AXIS2_PLACEMENT_3D('',{},{},{})", r(71), r(80), r(82)),
    );
    // Edges.
    put(
        50,
        format!("EDGE_CURVE('',{},{},{},.T.)", r(53), r(53), r(60)),
    );
    put(
        51,
        format!("EDGE_CURVE('',{},{},{},.T.)", r(54), r(54), r(61)),
    );
    put(
        52,
        format!("EDGE_CURVE('',{},{},{},.T.)", r(53), r(54), r(62)),
    );
    put(53, format!("VERTEX_POINT('',{})", r(72)));
    put(54, format!("VERTEX_POINT('',{})", r(73)));
    // Curves.
    put(
        46,
        format!("AXIS2_PLACEMENT_3D('',{},{},{})", r(70), r(80), r(82)),
    );
    put(60, format!("ELLIPSE('',{},{A:.1},{B:.1})", r(46)));
    put(61, format!("ELLIPSE('',{},{A:.1},{B:.1})", r(45)));
    put(62, format!("LINE('',{},{})", r(72), r(63)));
    put(63, format!("VECTOR('',{},{:.1})", r(80), z1 - z0));
    // Points and directions.
    put(70, format!("CARTESIAN_POINT('',(0.,0.,{z0:.1}))"));
    put(71, format!("CARTESIAN_POINT('',(0.,0.,{z1:.1}))"));
    put(72, format!("CARTESIAN_POINT('',({A:.1},0.,{z0:.1}))"));
    put(73, format!("CARTESIAN_POINT('',({A:.1},0.,{z1:.1}))"));
    put(80, "DIRECTION('',(0.,0.,1.))".to_owned());
    put(81, "DIRECTION('',(0.,0.,-1.))".to_owned());
    put(82, "DIRECTION('',(1.,0.,0.))".to_owned());
    out
}

fn file(solids: &[String]) -> String {
    format!(
        "ISO-10303-21;\nHEADER;\nENDSEC;\nDATA;\n{}ENDSEC;\nEND-ISO-10303-21;\n",
        solids.concat()
    )
}

#[test]
fn an_elliptic_extrusion_reads_as_its_cylinder() {
    let mut topo = Topology::new();
    let solids = brepkit_io::step::read_step(&file(&[solid(1, 0.0, 10.0)]), &mut topo).unwrap();
    assert_eq!(solids.len(), 1);
    let report = validate_solid(&topo, solids[0]).unwrap();
    assert!(report.is_valid(), "{:?}", report.issues);
    let volume = solid_volume(&topo, solids[0], 0.001).unwrap();
    let want = PI * A * B * 10.0;
    assert!(
        (volume - want).abs() < 1e-6 * want,
        "volume {volume}, want {want}"
    );
    let mesh = tessellate_solid(&topo, solids[0], 0.05).unwrap();
    assert!(is_watertight(&mesh), "open mesh");
}

#[test]
fn stacked_elliptic_extrusions_fuse_whole() {
    let mut topo = Topology::new();
    let text = file(&[solid(1, 0.0, 10.0), solid(101, 10.0, 25.0)]);
    let solids = brepkit_io::step::read_step(&text, &mut topo).unwrap();
    assert_eq!(solids.len(), 2);
    let before = mesh_fallback_count();
    let fused = boolean(&mut topo, BooleanOp::Fuse, solids[0], solids[1]).unwrap();
    assert_eq!(mesh_fallback_count(), before, "mesh fallback");
    let report = validate_solid(&topo, fused).unwrap();
    assert!(report.is_valid(), "{:?}", report.issues);
    let volume = solid_volume(&topo, fused, 0.001).unwrap();
    let want = PI * A * B * 25.0;
    assert!(
        (volume - want).abs() < 1e-6 * want,
        "volume {volume}, want {want}"
    );
    let mesh = tessellate_solid(&topo, fused, 0.05).unwrap();
    assert!(is_watertight(&mesh), "open mesh");
    assert!(solid_faces(&topo, fused).unwrap().len() >= 3);
}
