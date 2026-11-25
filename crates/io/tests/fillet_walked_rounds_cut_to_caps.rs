//! A small part (27 long) whose four B-spline edges along two tilted caps
//! are rounded at r = 0.2.
//!
//! Each walked round is cut back to its cap, so its contact on the B-spline
//! wall ends on the cap's edge, which stands 1.4e-4 off the wall: past the
//! band a contact's pcurve is fitted within. The pcurve fell back to the
//! line between its ends' parameters, and the end's parameters, found with
//! no seed, lay off the wall's domain, so the pcurve ran 216 off its edge.
//! The contact is now fitted within ten times the band, and one no cubic
//! follows takes the polyline through its image.
//!
//! A frame plate 300 thick (`frame_plate_spline_rims.step`), its B-spline
//! outline rounded at r = 20 on both rims, has a contact on its wall cut at
//! the wall's seam whose pieces no cubic follows within the fit either: each
//! took a line in the wall's parameters, read at another rate than the
//! edge, 545 off it halfway. Each piece now takes the polyline through its
//! image.
//!
//! Read from STEP, written by brepkit's own writer.
#![allow(
    clippy::unwrap_used,
    clippy::inconsistent_digit_grouping,
    clippy::unreadable_literal
)]

use std::path::Path;

use brepkit_io::step::reader::read_step;
use brepkit_math::vec::Point3;
use brepkit_operations::blend_ops::fillet_v2;
use brepkit_operations::validate::validate_solid;
use brepkit_topology::Topology;
use brepkit_topology::edge::EdgeId;
use brepkit_topology::explorer::solid_edges;
use brepkit_topology::solid::SolidId;

fn load(topo: &mut Topology, name: &str) -> SolidId {
    let path = Path::new(env!("CARGO_MANIFEST_DIR"))
        .join("tests/data")
        .join(name);
    read_step(&std::fs::read_to_string(path).unwrap(), topo).unwrap()[0]
}

/// The edge of `solid` passing nearest `p`, within `within`.
fn edge_through(topo: &Topology, solid: SolidId, p: Point3, within: f64) -> EdgeId {
    let off = |e: EdgeId| {
        let edge = topo.edge(e).unwrap();
        let (a, b) = (
            topo.vertex(edge.start()).unwrap().point(),
            topo.vertex(edge.end()).unwrap().point(),
        );
        let (t0, t1) = edge.curve().domain_with_endpoints(a, b);
        (0..=2000)
            .map(|k| {
                let t = (t1 - t0).mul_add(f64::from(k) / 2000.0, t0);
                (edge.curve().evaluate_with_endpoints(t, a, b) - p).length()
            })
            .fold(f64::MAX, f64::min)
    };
    let best = solid_edges(topo, solid)
        .unwrap()
        .into_iter()
        .min_by(|&a, &b| off(a).total_cmp(&off(b)))
        .unwrap();
    assert!(off(best) < within, "no edge through {p:?}");
    best
}

#[test]
fn walked_rounds_cut_back_to_their_caps_have_pcurves_on_their_edges() {
    let mut topo = Topology::new();
    let part = load(&mut topo, "tilted_cap_rounds.step");
    let picks: Vec<EdgeId> = [
        Point3::new(
            -6.457_982_934_938_656,
            1.304_213_269_860_559_7,
            -6.984_613_903_337_634,
        ),
        Point3::new(
            -6.491_006_269_513_885_5,
            0.865_031_892_695_857_8,
            -6.984_613_623_426_638,
        ),
        Point3::new(
            -9.114_747_228_301_708,
            1.529_853_814_476_913_6,
            -6.310_676_216_475_415,
        ),
        Point3::new(
            -9.147_589_540_326_3,
            1.093_041_849_298_217_2,
            -6.310_676_652_123_462,
        ),
    ]
    .into_iter()
    .map(|p| edge_through(&topo, part, p, 1e-3))
    .collect();
    let result = fillet_v2(&mut topo, part, &picks, 0.2).unwrap();
    let report = validate_solid(&topo, result.solid).unwrap();
    assert!(report.is_valid(), "{:?}", report.issues);
}

#[test]
fn contact_pieces_cut_at_a_wall_s_seam_have_pcurves_on_their_edges() {
    let mut topo = Topology::new();
    let part = load(&mut topo, "frame_plate_spline_rims.step");
    let picks: Vec<EdgeId> = [
        Point3::new(2142.597_414_444_431_3, -487.521_905_690_147_2, 150.0),
        Point3::new(1891.021_706_222_250_3, -994.775_475_177_704_4, 150.0),
        Point3::new(1891.016_508_103_415_8, -994.772_362_805_512_8, -150.0),
        Point3::new(2142.613_139_611_622_5, -487.531_412_158_196_13, -150.0),
    ]
    .into_iter()
    .map(|p| edge_through(&topo, part, p, 3.0))
    .collect();
    let result = fillet_v2(&mut topo, part, &picks, 20.0).unwrap();
    let report = validate_solid(&topo, result.solid).unwrap();
    assert!(report.is_valid(), "{:?}", report.issues);
}
