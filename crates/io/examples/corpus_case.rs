//! Replay one BuzzCAD corpus boolean case natively.
//!
//! A replay exports each failing case as `failures/<op>/<key>/` holding
//! `case.json`, `input0.step`, `input1.step` and `occ.step`. This loads the
//! inputs the way the BuzzCAD bridge does and runs the boolean with the
//! bridge's options, then reports whether it stayed exact and the result's
//! face census next to Open CASCADE's.
//!
//! ```sh
//! LOG=1 cargo run --release -p brepkit-io \
//!   --example corpus_case -- <case dir>
//! ```
//!
//! With a `.step` file instead of a case directory it prints each face of
//! the file's first solid: surface, loop count, and its area measured
//! exactly and from its mesh, so a face that imported wrong stands out.
#![allow(
    clippy::print_stdout,
    clippy::print_stderr,
    clippy::expect_used,
    clippy::unwrap_used,
    clippy::panic
)]

use std::collections::BTreeMap;
use std::path::Path;

use brepkit_operations::boolean::{BooleanOp, BooleanOptions};
use brepkit_topology::Topology;
use brepkit_topology::explorer::solid_faces;
use brepkit_topology::solid::SolidId;

fn census(topo: &Topology, sid: SolidId) -> String {
    let mut mix: BTreeMap<&'static str, usize> = BTreeMap::new();
    for fid in solid_faces(topo, sid).unwrap() {
        *mix.entry(topo.face(fid).unwrap().surface().type_tag())
            .or_default() += 1;
    }
    let vol =
        brepkit_operations::measure::oriented_solid_volume(topo, sid, 0.01).unwrap_or(f64::NAN);
    let sv = brepkit_operations::measure::solid_volume(topo, sid, 0.001).unwrap_or(f64::NAN);
    format!("{mix:?} volume={vol:.4} solid_volume={sv:.4}")
}

fn faces(path: &Path) {
    let mut topo = Topology::new();
    let text = std::fs::read_to_string(path).unwrap();
    let sid = brepkit_io::step::read_step(&text, &mut topo).unwrap()[0];
    face_table(&topo, sid);
    // FACE=<i>: that face's loops, vertex by vertex
    if let Some(i) = std::env::var("FACE")
        .ok()
        .and_then(|v| v.parse::<usize>().ok())
    {
        let fid = solid_faces(&topo, sid).unwrap()[i];
        let face = topo.face(fid).unwrap();
        for (k, w) in std::iter::once(face.outer_wire())
            .chain(face.inner_wires().iter().copied())
            .enumerate()
        {
            for oe in topo.wire(w).unwrap().edges() {
                let e = topo.edge(oe.edge()).unwrap();
                let p = topo.vertex(oe.oriented_start(e)).unwrap().point();
                println!(
                    "  loop {k} {} from ({:.3},{:.3},{:.3})",
                    e.curve().type_tag(),
                    p.x(),
                    p.y(),
                    p.z()
                );
            }
        }
    }
}

fn face_table(topo: &Topology, sid: SolidId) {
    for (i, fid) in solid_faces(topo, sid).unwrap().into_iter().enumerate() {
        let face = topo.face(fid).unwrap();
        let exact = brepkit_operations::measure::face_area(topo, fid, 0.01).unwrap_or(f64::NAN);
        let mesh = brepkit_operations::tessellate::tessellate(topo, fid, 0.01).unwrap();
        let mut area = 0.0;
        for t in mesh.indices.chunks_exact(3) {
            let [a, b, c] = [0, 1, 2].map(|k| mesh.positions[t[k] as usize]);
            area += (b - a).cross(c - a).length() / 2.0;
        }
        let flag = if (area - exact).abs() > 0.01 * exact.abs().max(1.0) {
            "  <<"
        } else {
            ""
        };
        let what = match face.surface() {
            brepkit_topology::face::FaceSurface::Cylinder(c) => {
                let (o, d) = (c.origin(), c.axis());
                format!(
                    " r={} axis ({:.3},{:.3},{:.3}) dir ({:.3},{:.3},{:.3})",
                    c.radius(),
                    o.x(),
                    o.y(),
                    o.z(),
                    d.x(),
                    d.y(),
                    d.z()
                )
            }
            brepkit_topology::face::FaceSurface::Plane { normal, d } => {
                format!(
                    " n=({:.3},{:.3},{:.3}) d={d:.3}",
                    normal.x(),
                    normal.y(),
                    normal.z()
                )
            }
            _ => String::new(),
        };
        println!(
            "face {i:3} {:9} rev={} loops={} exact={exact:12.4} mesh={area:12.4}{flag}{what}",
            face.surface().type_tag(),
            u8::from(face.is_reversed()),
            1 + face.inner_wires().len()
        );
        // WIRES=<i,j,...>: those faces' loops, edge by edge
        if std::env::var("WIRES").is_ok_and(|v| v.split(',').any(|t| t == i.to_string())) {
            for w in std::iter::once(face.outer_wire()).chain(face.inner_wires().iter().copied()) {
                println!("  loop");
                for oe in topo.wire(w).unwrap().edges() {
                    let e = topo.edge(oe.edge()).unwrap();
                    let (p, q) = (
                        topo.vertex(oe.oriented_start(e)).unwrap().point(),
                        topo.vertex(oe.oriented_end(e)).unwrap().point(),
                    );
                    let (es, ee) = (
                        topo.vertex(e.start()).unwrap().point(),
                        topo.vertex(e.end()).unwrap().point(),
                    );
                    let dom = e.curve().domain_with_endpoints(es, ee);
                    println!(
                        "    e{} {} dom=({:.4},{:.4}) ({:.3},{:.3},{:.3})->({:.3},{:.3},{:.3})",
                        oe.edge().index(),
                        e.curve().type_tag(),
                        dom.0,
                        dom.1,
                        p.x(),
                        p.y(),
                        p.z(),
                        q.x(),
                        q.y(),
                        q.z()
                    );
                }
            }
        }
    }
}

/// Every edge used once or more than twice by the solid's faces: its curve,
/// ends, and the faces using it.
fn open_edges(topo: &Topology, sid: SolidId) {
    let mut users: BTreeMap<usize, Vec<(usize, &'static str, bool)>> = BTreeMap::new();
    for (i, fid) in solid_faces(topo, sid).unwrap().into_iter().enumerate() {
        let face = topo.face(fid).unwrap();
        for wid in std::iter::once(face.outer_wire()).chain(face.inner_wires().iter().copied()) {
            for oe in topo.wire(wid).unwrap().edges() {
                users.entry(oe.edge().index()).or_default().push((
                    i,
                    face.surface().type_tag(),
                    oe.is_forward(),
                ));
            }
        }
    }
    let eids: BTreeMap<usize, brepkit_topology::edge::EdgeId> = solid_faces(topo, sid)
        .unwrap()
        .into_iter()
        .flat_map(|f| {
            let face = topo.face(f).unwrap();
            std::iter::once(face.outer_wire())
                .chain(face.inner_wires().iter().copied())
                .flat_map(|w| {
                    topo.wire(w)
                        .unwrap()
                        .edges()
                        .iter()
                        .map(brepkit_topology::wire::OrientedEdge::edge)
                        .collect::<Vec<_>>()
                })
                .collect::<Vec<_>>()
        })
        .map(|e| (e.index(), e))
        .collect();
    for (idx, us) in &users {
        if us.len() == 2 {
            continue;
        }
        let e = topo.edge(eids[idx]).unwrap();
        let (p, q) = (
            topo.vertex(e.start()).unwrap().point(),
            topo.vertex(e.end()).unwrap().point(),
        );
        println!(
            "  edge {idx} used {}x {} ({:.4},{:.4},{:.4})->({:.4},{:.4},{:.4}) by {us:?}",
            us.len(),
            e.curve().type_tag(),
            p.x(),
            p.y(),
            p.z(),
            q.x(),
            q.y(),
            q.z()
        );
    }
}

/// Edges where two plane faces meet facing opposite ways: the solid folds
/// back on itself there (a zero-thickness flap).
fn folds(topo: &Topology, sid: SolidId) {
    let mut users: BTreeMap<usize, Vec<(usize, brepkit_math::vec::Vec3)>> = BTreeMap::new();
    let mut ends: BTreeMap<usize, (brepkit_math::vec::Point3, brepkit_math::vec::Point3)> =
        BTreeMap::new();
    for (i, fid) in solid_faces(topo, sid).unwrap().into_iter().enumerate() {
        let face = topo.face(fid).unwrap();
        let brepkit_topology::face::FaceSurface::Plane { normal, .. } = face.surface() else {
            continue;
        };
        let n = if face.is_reversed() {
            -*normal
        } else {
            *normal
        };
        for wid in std::iter::once(face.outer_wire()).chain(face.inner_wires().iter().copied()) {
            for oe in topo.wire(wid).unwrap().edges() {
                let e = topo.edge(oe.edge()).unwrap();
                ends.insert(
                    oe.edge().index(),
                    (
                        topo.vertex(e.start()).unwrap().point(),
                        topo.vertex(e.end()).unwrap().point(),
                    ),
                );
                users.entry(oe.edge().index()).or_default().push((i, n));
            }
        }
    }
    for (idx, us) in &users {
        if us.len() == 2 && us[0].1.dot(us[1].1) < -0.999 && us[0].0 != us[1].0 {
            let (p, q) = ends[idx];
            println!(
                "  fold at edge {idx} faces {} {} ({:.4},{:.4},{:.4})->({:.4},{:.4},{:.4})",
                us[0].0,
                us[1].0,
                p.x(),
                p.y(),
                p.z(),
                q.x(),
                q.y(),
                q.z()
            );
        }
    }
}

/// Rewrites each reversed planar face as the same face unreversed: the
/// plane's normal flipped and every loop run the other way (brepkit winds
/// loops about the surface normal). An experiment: whether the reversed flag
/// alone changes a boolean's outcome.
fn unreverse_planes(topo: &mut Topology, sid: SolidId) -> usize {
    use brepkit_topology::face::FaceSurface;
    use brepkit_topology::wire::{OrientedEdge, Wire};
    let mut n = 0;
    let only: Option<usize> = std::env::var("NORM_FACE").ok().and_then(|v| v.parse().ok());
    for (i, fid) in solid_faces(topo, sid).unwrap().into_iter().enumerate() {
        if only.is_some_and(|k| k != i) {
            continue;
        }
        let face = topo.face(fid).unwrap();
        let FaceSurface::Plane { normal, d } = *face.surface() else {
            continue;
        };
        if !face.is_reversed() {
            continue;
        }
        let wires: Vec<_> = std::iter::once(face.outer_wire())
            .chain(face.inner_wires().iter().copied())
            .collect();
        let mut flipped = Vec::new();
        for w in wires {
            let edges: Vec<OrientedEdge> = topo
                .wire(w)
                .unwrap()
                .edges()
                .iter()
                .rev()
                .map(|oe| OrientedEdge::new(oe.edge(), !oe.is_forward()))
                .collect();
            flipped.push(topo.add_wire(Wire::new(edges, true).unwrap()));
        }
        let f = topo.face_mut(fid).unwrap();
        f.set_outer_wire(flipped[0]);
        *f.inner_wires_mut() = flipped[1..].to_vec();
        f.set_surface(FaceSurface::Plane {
            normal: -normal,
            d: -d,
        });
        f.set_reversed(false);
        n += 1;
    }
    n
}

fn read(dir: &Path, name: &str, topo: &mut Topology) -> Vec<SolidId> {
    let text = std::fs::read_to_string(dir.join(name)).unwrap();
    brepkit_io::step::read_step(&text, topo).unwrap()
}

/// Prints `brepkit_operations` log records at debug and above (the gate's
/// reject detail is a debug record); no logger crate is a dependency here.
struct Stderr;
impl log::Log for Stderr {
    fn enabled(&self, m: &log::Metadata) -> bool {
        m.target().starts_with("brepkit") && m.level() <= log::Level::Debug
    }
    fn log(&self, r: &log::Record) {
        if self.enabled(r.metadata()) {
            eprintln!("[{} {}] {}", r.level(), r.target(), r.args());
        }
    }
    fn flush(&self) {}
}

fn main() {
    if std::env::var("LOG").is_ok() {
        log::set_logger(&Stderr).unwrap();
        log::set_max_level(log::LevelFilter::Debug);
    }
    let dir = std::path::PathBuf::from(std::env::args().nth(1).expect("case dir"));
    if dir.extension().is_some_and(|e| e == "step") {
        faces(&dir);
        return;
    }
    let case: serde_json::Value =
        serde_json::from_str(&std::fs::read_to_string(dir.join("case.json")).unwrap()).unwrap();
    let op = match case["params"]["mode"].as_str().unwrap() {
        "fuse" => BooleanOp::Fuse,
        "cut" => BooleanOp::Cut,
        "intersect" => BooleanOp::Intersect,
        m => panic!("unknown mode {m}"),
    };
    let mut topo = Topology::new();
    let a = read(&dir, "input0.step", &mut topo);
    let b = read(&dir, "input1.step", &mut topo);
    if std::env::var("NORMALIZE").is_ok() {
        let which = std::env::var("NORMALIZE").unwrap();
        let mut n = 0;
        if which != "b" {
            n += unreverse_planes(&mut topo, a[0]);
        }
        if which != "a" {
            n += unreverse_planes(&mut topo, b[0]);
        }
        println!("NORMALIZE: {n} reversed plane faces rewritten unreversed");
    }
    println!("op={op:?} a={} solids b={} solids", a.len(), b.len());
    println!("A: {}", census(&topo, a[0]));
    if std::env::var("FOLDS").is_ok() {
        println!("A folds:");
        folds(&topo, a[0]);
        println!("B folds:");
        folds(&topo, b[0]);
    }
    println!("B: {}", census(&topo, b[0]));
    let mut occ_topo = Topology::new();
    if let Some(&occ) = read(&dir, "occ.step", &mut occ_topo).first() {
        println!("OCC: {}", census(&occ_topo, occ));
        if std::env::var("FOLDS").is_ok() {
            println!("OCC folds:");
            folds(&occ_topo, occ);
        }
    }
    if std::env::var("RAW").is_ok() {
        let bop = match op {
            BooleanOp::Fuse => brepkit_algo::bop::BooleanOp::Fuse,
            BooleanOp::Cut => brepkit_algo::bop::BooleanOp::Cut,
            BooleanOp::Intersect => brepkit_algo::bop::BooleanOp::Intersect,
        };
        match brepkit_algo::gfa::boolean(&mut topo, bop, a[0], b[0]) {
            Ok(s) => {
                println!("raw GFA: {}", census(&topo, s));
                // OUT=<file.step>: the raw result, for the per-face table mode
                if let Ok(out) = std::env::var("OUT") {
                    std::fs::write(&out, brepkit_io::step::write_step(&topo, &[s]).unwrap())
                        .unwrap();
                }
                open_edges(&topo, s);
                if std::env::var("FACES").is_ok() {
                    face_table(&topo, s);
                }
            }
            Err(e) => println!("raw GFA error: {e}"),
        }
        return;
    }
    // A cut by a body of several solids runs as the bridge runs it: each
    // cutter whose box meets the part, in turn. STEP=<i> stops before cutter
    // i and writes the part so far to part.step and the cutter to tool.step,
    // for the case's failing step to be replayed alone.
    if op == BooleanOp::Cut && (b.len() > 1 || a.len() > 1) {
        let stop: Option<usize> = std::env::var("STEP").ok().and_then(|v| v.parse().ok());
        for (ai, &part) in a.iter().enumerate() {
            let mut s = part;
            for (j, &c) in b.iter().enumerate() {
                let (pb, cb) = (
                    brepkit_operations::measure::solid_bounding_box(&topo, s).unwrap(),
                    brepkit_operations::measure::solid_bounding_box(&topo, c).unwrap(),
                );
                if !pb.intersects(cb) {
                    continue;
                }
                if stop == Some(j) {
                    std::fs::write(
                        "part.step",
                        brepkit_io::step::write_step(&topo, &[s]).unwrap(),
                    )
                    .unwrap();
                    std::fs::write(
                        "tool.step",
                        brepkit_io::step::write_step(&topo, &[c]).unwrap(),
                    )
                    .unwrap();
                    println!("wrote part.step and tool.step for solid {ai}, cutter {j}");
                    return;
                }
                let before = brepkit_operations::boolean::mesh_fallback_count();
                match brepkit_operations::boolean::boolean_with_options(
                    &mut topo,
                    op,
                    s,
                    c,
                    BooleanOptions::default(),
                ) {
                    Ok(r) => {
                        let fb = brepkit_operations::boolean::mesh_fallback_count() > before;
                        let valid = brepkit_operations::validate::validate_solid(&topo, r)
                            .is_ok_and(|v| v.is_valid());
                        println!(
                            "solid {ai} cutter {j}: fallback={fb} valid={valid} {}",
                            census(&topo, r)
                        );
                        s = r;
                    }
                    Err(e) => {
                        println!("solid {ai} cutter {j}: error {e}");
                        break;
                    }
                }
            }
        }
        return;
    }
    let before = brepkit_operations::boolean::mesh_fallback_count();
    let r = brepkit_operations::boolean::boolean_with_options(
        &mut topo,
        op,
        a[0],
        b[0],
        // NOUNIFY=1: leave co-surface faces split, to tell the merge's
        // effect from the boolean's
        BooleanOptions {
            unify_faces: std::env::var("NOUNIFY").is_err(),
            ..BooleanOptions::default()
        },
    );
    let fell_back = brepkit_operations::boolean::mesh_fallback_count() > before;
    match r {
        Ok(s) => {
            let valid = brepkit_operations::validate::validate_solid(&topo, s)
                .map(|r| {
                    if r.is_valid() {
                        "valid".to_string()
                    } else {
                        format!("INVALID {:?}", r.issues)
                    }
                })
                .unwrap_or_default();
            println!(
                "brepkit (fallback={fell_back}): {} {valid}",
                census(&topo, s)
            );
            if std::env::var("FACES").is_ok() {
                face_table(&topo, s);
            }
            // SOLIDMESH=1: each face's area in the solid's shared-edge mesh
            if std::env::var("SOLIDMESH").is_ok() {
                let (mesh, offsets) =
                    brepkit_operations::tessellate::tessellate_solid_grouped_with_tolerance(
                        &topo,
                        s,
                        0.01,
                        brepkit_math::chord::DEFAULT_ANGULAR_TOL,
                    )
                    .unwrap();
                let faces = solid_faces(&topo, s).unwrap();
                for (fi, span) in offsets.windows(2).enumerate() {
                    let mut area = 0.0;
                    let mut vol = 0.0;
                    for t in mesh.indices[span[0] as usize..span[1] as usize].chunks_exact(3) {
                        let [a, b, c] = [0, 1, 2].map(|k| mesh.positions[t[k] as usize]);
                        area += (b - a).cross(c - a).length() / 2.0;
                        let o = brepkit_math::vec::Point3::new(0.0, 0.0, 0.0);
                        let (a, b, c) = (a - o, b - o, c - o);
                        vol += a.dot(b.cross(c)) / 6.0;
                    }
                    let exact = brepkit_operations::measure::face_area(&topo, faces[fi], 0.01)
                        .unwrap_or(f64::NAN);
                    println!(
                        "solidmesh face {fi:3} area={area:12.4} exact={exact:12.4} vol={vol:12.4}"
                    );
                }
            }
            // FOLDS=1: plane faces meeting face to face
            if std::env::var("FOLDS").is_ok() {
                println!("result folds:");
                folds(&topo, s);
            }
        }
        Err(e) => println!("brepkit error: {e}"),
    }
}
