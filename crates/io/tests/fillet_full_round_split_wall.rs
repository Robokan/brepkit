//! A plate 12 thick whose outline is one closed B-spline, its wall split at
//! half height into two faces, both rims rounded at r = 6: a full round.
//! Each round's contact on the wall lands on the wall's middle rim, and
//! each half of the wall is left a sliver between that rim and the
//! contact, which goes.
//!
//! The outline bends one way and back just past its seam. The walk's first
//! step was the longest step allowed, about 19 along the rim, and the steps
//! after it, round the bend, about 1. Interpolated through sections spaced
//! so unevenly, the contact swung 0.19 off the wall across the first gap,
//! so it no longer lay on the middle rim, the slivers stayed, and the
//! result came out open. The walk's first step now starts short and grows.
//! Read from STEP, as a file gives the part.
#![allow(clippy::unwrap_used, clippy::expect_used)]

use std::f64::consts::PI;
use std::path::Path;

use brepkit_io::step::reader::read_step;
use brepkit_operations::blend_ops::fillet_v2;
use brepkit_operations::measure::{face_area, solid_volume};
use brepkit_operations::tessellate::{is_watertight, tessellate_solid};
use brepkit_operations::validate::validate_solid;
use brepkit_topology::Topology;
use brepkit_topology::edge::{EdgeCurve, EdgeId};
use brepkit_topology::explorer::{solid_edges, solid_faces};
use brepkit_topology::face::FaceSurface;
use brepkit_topology::solid::SolidId;

const R: f64 = 6.0;

fn load(topo: &mut Topology) -> SolidId {
    let path =
        Path::new(env!("CARGO_MANIFEST_DIR")).join("tests/data/split_wall_spline_plate.step");
    read_step(&std::fs::read_to_string(path).unwrap(), topo).unwrap()[0]
}

/// The plate's closed B-spline rim at height `z`.
fn rim_at(topo: &Topology, solid: SolidId, z: f64) -> EdgeId {
    solid_edges(topo, solid)
        .unwrap()
        .into_iter()
        .find(|&e| {
            let edge = topo.edge(e).unwrap();
            matches!(edge.curve(), EdgeCurve::NurbsCurve(_))
                && edge.start() == edge.end()
                && (topo.vertex(edge.start()).unwrap().point().z() - z).abs() < 1e-6
        })
        .expect("a closed rim at that height")
}

/// Each rim's round takes off its corner's section, `r^2 (1 - pi / 4)`,
/// swept along the path of its centroid, which stands `c` in from the wall
/// and so runs `L - 2 pi c` round the closed outline of length `L` (Pappus).
/// The wall stands square to the plate, so `L` is its area over its height.
#[test]
fn a_full_round_of_a_wall_split_at_half_height() {
    let mut topo = Topology::new();
    let solid = load(&mut topo);
    let walls: f64 = solid_faces(&topo, solid)
        .unwrap()
        .into_iter()
        .filter(|&f| matches!(topo.face(f).unwrap().surface(), FaceSurface::Nurbs(_)))
        .map(|f| face_area(&topo, f, 1e-4).unwrap())
        .sum();
    let perimeter = walls / (2.0 * R);
    let section = R * R * (1.0 - PI / 4.0);
    let centroid = R * 3.0f64.mul_add(-PI, 10.0) / (3.0 * (4.0 - PI));
    let removed = 2.0 * section * 2.0f64.mul_add(-PI * centroid, perimeter);

    let before = solid_volume(&topo, solid, 1e-3).unwrap();
    let edges = [rim_at(&topo, solid, -R), rim_at(&topo, solid, R)];
    let result = fillet_v2(&mut topo, solid, &edges, R).unwrap();
    assert!(result.failed.is_empty(), "{:?}", result.failed);
    let report = validate_solid(&topo, result.solid).unwrap();
    assert!(report.is_valid(), "{:?}", report.issues);
    assert_eq!(
        solid_faces(&topo, result.solid).unwrap().len(),
        4,
        "the two caps and the two rounds, the wall gone"
    );
    let mesh = tessellate_solid(&topo, result.solid, 0.05).unwrap();
    assert!(is_watertight(&mesh), "mesh not watertight");
    let lost = before - solid_volume(&topo, result.solid, 1e-3).unwrap();
    assert!(
        (lost - removed).abs() <= 1e-3 * removed,
        "lost {lost}, the full round {removed}"
    );
}
