//! Replay one BuzzCAD corpus fillet case natively.
//!
//! Takes a replay's `failures/fillet/<key>/` directory (`case.json`,
//! `input0.step`), picks each recorded edge as the solid's edge passing
//! nearest the case's point on it, runs `fillet_v2` as the bridge does,
//! and reports each edge's failure or the result's faces, volume, open
//! edges and validity next to the case's reference answer.
//!
//! ```sh
//! cargo run --release -p brepkit-io --example corpus_fillet -- <case dir> [radius]
//! ```
#![allow(
    clippy::print_stdout,
    clippy::print_stderr,
    clippy::expect_used,
    clippy::unwrap_used,
    clippy::panic
)]

use std::collections::BTreeMap;
use std::path::Path;

use brepkit_math::vec::Point3;
use brepkit_topology::Topology;
use brepkit_topology::edge::EdgeId;
use brepkit_topology::explorer::{face_edges, solid_edges, solid_faces};
use brepkit_topology::solid::SolidId;

fn json_f64(v: &serde_json::Value) -> f64 {
    v.as_f64().unwrap_or(f64::NAN)
}

/// The edge of `sid` passing nearest `p`, and how near.
fn nearest_edge(topo: &Topology, sid: SolidId, p: Point3) -> (EdgeId, f64) {
    let mut best = (None, f64::INFINITY);
    for eid in solid_edges(topo, sid).unwrap() {
        let e = topo.edge(eid).unwrap();
        let (a, b) = (
            topo.vertex(e.start()).unwrap().point(),
            topo.vertex(e.end()).unwrap().point(),
        );
        let (t0, t1) = e.curve().domain_with_endpoints(a, b);
        for k in 0..=256 {
            let t = t0 + (t1 - t0) * f64::from(k) / 256.0;
            let d = (e.curve().evaluate_with_endpoints(t, a, b) - p).length();
            if d < best.1 {
                best = (Some(eid), d);
            }
        }
    }
    (best.0.unwrap(), best.1)
}

/// Edges used by one face, or by more than two.
fn bad_edges(topo: &Topology, sid: SolidId) -> (usize, usize) {
    let mut uses: BTreeMap<usize, usize> = BTreeMap::new();
    for fid in solid_faces(topo, sid).unwrap() {
        let face = topo.face(fid).unwrap();
        for w in std::iter::once(face.outer_wire()).chain(face.inner_wires().iter().copied()) {
            for oe in topo.wire(w).unwrap().edges() {
                *uses.entry(oe.edge().index()).or_default() += 1;
            }
        }
    }
    (
        uses.values().filter(|&&n| n == 1).count(),
        uses.values().filter(|&&n| n > 2).count(),
    )
}

/// For each face along `eid`: the direction into the face that the blend
/// engine reads (normal x the edge's direction along the face's wire), next
/// to the direction from the edge's middle toward the face's mesh centroid.
fn sides(topo: &Topology, sid: SolidId, eid: EdgeId) {
    let e = topo.edge(eid).unwrap();
    let (ps, pe) = (
        topo.vertex(e.start()).unwrap().point(),
        topo.vertex(e.end()).unwrap().point(),
    );
    let (t0, t1) = e.curve().domain_with_endpoints(ps, pe);
    let t = f64::midpoint(t0, t1);
    let mid = e.curve().evaluate_with_endpoints(t, ps, pe);
    for fid in solid_faces(topo, sid).unwrap() {
        let f = topo.face(fid).unwrap();
        for w in std::iter::once(f.outer_wire()).chain(f.inner_wires().iter().copied()) {
            for oe in topo.wire(w).unwrap().edges() {
                if oe.edge() != eid {
                    continue;
                }
                let mut along = e.curve().tangent_with_endpoints(t, ps, pe);
                if (t1 < t0) == oe.is_forward() {
                    along = -along;
                }
                let (u, v) = f.surface().project_point(mid).unwrap_or((0.0, 0.0));
                let n = f.surface().normal(u, v);
                let n = if f.is_reversed() { -n } else { n };
                let left = n.cross(along).normalize().unwrap();
                let mesh = brepkit_operations::tessellate::tessellate(topo, fid, 0.1).unwrap();
                let c = mesh
                    .positions
                    .iter()
                    .fold(Point3::new(0.0, 0.0, 0.0), |a, p| {
                        a + (*p - Point3::new(0.0, 0.0, 0.0)) * (1.0 / mesh.positions.len() as f64)
                    });
                let toward = (c - mid).normalize().unwrap();
                println!(
                    "    face {} {} rev={} fwd={} dom=({t0:.3},{t1:.3}) along={along:?} left.toward={:.3}",
                    fid.index(),
                    f.surface().type_tag(),
                    u8::from(f.is_reversed()),
                    oe.is_forward(),
                    left.dot(toward)
                );
            }
        }
    }
}

fn census(topo: &Topology, sid: SolidId) -> String {
    let mut mix: BTreeMap<&'static str, usize> = BTreeMap::new();
    for fid in solid_faces(topo, sid).unwrap() {
        *mix.entry(topo.face(fid).unwrap().surface().type_tag())
            .or_default() += 1;
    }
    mix.iter()
        .map(|(k, v)| format!("{k}:{v}"))
        .collect::<Vec<_>>()
        .join(" ")
}

/// Prints brepkit log records (`LOG=1` debug, `LOG=trace`).
struct Stderr;
impl log::Log for Stderr {
    fn enabled(&self, m: &log::Metadata) -> bool {
        m.target().starts_with("brepkit") && m.level() <= log::max_level()
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
        log::set_max_level(if std::env::var("LOG").is_ok_and(|v| v == "trace") {
            log::LevelFilter::Trace
        } else {
            log::LevelFilter::Debug
        });
    }
    let dir = std::env::args().nth(1).expect("case directory");
    let dir = Path::new(&dir);
    let case: serde_json::Value =
        serde_json::from_str(&std::fs::read_to_string(dir.join("case.json")).unwrap()).unwrap();
    let radius = std::env::args().nth(2).map_or_else(
        || json_f64(&case["params"]["radius"]),
        |r| r.parse().unwrap(),
    );
    let mut topo = Topology::new();
    let text = std::fs::read_to_string(dir.join("input0.step")).unwrap();
    let sid = brepkit_io::step::read_step(&text, &mut topo).unwrap()[0];
    let n_faces = solid_faces(&topo, sid).unwrap().len();
    println!("input: {} faces ({})", n_faces, census(&topo, sid));
    // INVOL=1 prints the input's own volume as brepkit measures it.
    if std::env::var("INVOL").is_ok() {
        println!(
            "input volume {:.4}",
            brepkit_operations::measure::solid_volume(&topo, sid, 0.1).unwrap()
        );
    }
    // INPUT=1 lists the input's faces, each loop's edges and their curves.
    if std::env::var("INPUT").is_ok() {
        for f in solid_faces(&topo, sid).unwrap() {
            let face = topo.face(f).unwrap();
            println!(
                "  face {} {} rev={}",
                f.index(),
                face.surface().type_tag(),
                u8::from(face.is_reversed())
            );
            for w in std::iter::once(face.outer_wire()).chain(face.inner_wires().iter().copied()) {
                let line: Vec<String> = topo
                    .wire(w)
                    .unwrap()
                    .edges()
                    .iter()
                    .map(|oe| {
                        let e = topo.edge(oe.edge()).unwrap();
                        format!(
                            "{}{}{}[{}-{}]",
                            if oe.is_forward() { "+" } else { "-" },
                            oe.edge().index(),
                            &e.curve().type_tag()[..2],
                            e.start().index(),
                            e.end().index()
                        )
                    })
                    .collect();
                println!("    loop {}", line.join(" "));
            }
        }
        // With VERTS=1 too, every vertex's position.
        if std::env::var("VERTS").is_ok() {
            for v in brepkit_topology::explorer::solid_vertices(&topo, sid).unwrap() {
                let p = topo.vertex(v).unwrap().point();
                println!(
                    "  vertex {} ({:.6}, {:.6}, {:.6})",
                    v.index(),
                    p.x(),
                    p.y(),
                    p.z()
                );
            }
        }
    }
    let mut edges = Vec::new();
    for pick in case["picks"]["edges"].as_array().unwrap() {
        let p = pick["point"].as_array().unwrap();
        let p = Point3::new(json_f64(&p[0]), json_f64(&p[1]), json_f64(&p[2]));
        let (eid, d) = nearest_edge(&topo, sid, p);
        let e = topo.edge(eid).unwrap();
        let faces: Vec<&str> = solid_faces(&topo, sid)
            .unwrap()
            .into_iter()
            .filter(|&f| face_edges(&topo, f).unwrap().contains(&eid))
            .map(|f| topo.face(f).unwrap().surface().type_tag())
            .collect();
        println!(
            "pick {} -> edge {} {} (off {d:.2e}) between {faces:?}",
            pick["index"],
            eid.index(),
            e.curve().type_tag()
        );
        if std::env::var("SIDES").is_ok() {
            sides(&topo, sid, eid);
        }
        if std::env::var("VERTS").is_ok() {
            for v in [e.start(), e.end()] {
                println!("    {v:?} {:?}", topo.vertex(v).unwrap().point());
            }
        }
        edges.push(eid);
    }
    edges.dedup();
    // KINKS=1 prints the turn between picked edges at each vertex they share.
    if std::env::var("KINKS").is_ok() {
        let along = |eid: brepkit_topology::edge::EdgeId, at_start: bool| {
            let e = topo.edge(eid).unwrap();
            let (a, b) = (
                topo.vertex(e.start()).unwrap().point(),
                topo.vertex(e.end()).unwrap().point(),
            );
            let (t0, t1) = e.curve().domain_with_endpoints(a, b);
            let h = (t1 - t0) * 1e-6;
            let (t, s) = if at_start { (t0, 1.0) } else { (t1, -1.0) };
            let p = e.curve().evaluate_with_endpoints(t, a, b);
            let q = e.curve().evaluate_with_endpoints(t + s * h, a, b);
            (q - p).normalize().unwrap()
        };
        for (i, &x) in edges.iter().enumerate() {
            for &y in &edges[i + 1..] {
                let (ex, ey) = (topo.edge(x).unwrap(), topo.edge(y).unwrap());
                for (vx, sx) in [(ex.start(), true), (ex.end(), false)] {
                    for (vy, sy) in [(ey.start(), true), (ey.end(), false)] {
                        if vx == vy {
                            // Both directions leave the vertex; a smooth join has them opposite.
                            let turn = (-along(x, sx)).dot(along(y, sy)).clamp(-1.0, 1.0).acos();
                            println!(
                                "  kink at {vx:?} edges {} {}: {:.6} deg",
                                x.index(),
                                y.index(),
                                turn.to_degrees()
                            );
                        }
                    }
                }
            }
        }
    }
    // CHAIN=<radians> also rounds each pick's tangent chain
    // (`query::tangent_chain`), as some kernels do.
    if let Ok(angle) = std::env::var("CHAIN") {
        let chained =
            brepkit_operations::query::tangent_chain(&topo, sid, &edges, angle.parse().unwrap())
                .unwrap();
        for e in &chained[edges.len()..] {
            println!("  chain adds edge {}", e.index());
        }
        edges = chained;
    }
    // PICK=0,2,5 keeps only those positions of the case's pick list.
    if let Ok(keep) = std::env::var("PICK") {
        let keep: Vec<usize> = keep.split(',').map(|k| k.trim().parse().unwrap()).collect();
        edges = edges
            .iter()
            .enumerate()
            .filter(|(i, _)| keep.contains(i))
            .map(|(_, &e)| e)
            .collect();
        println!("keeping picks {keep:?}");
    }
    let t = std::time::Instant::now();
    match brepkit_operations::blend_ops::fillet_v2(&mut topo, sid, &edges, radius) {
        Err(e) => println!("fillet r={radius}: error: {e}"),
        Ok(r) => {
            for (eid, why) in &r.failed {
                println!("  failed edge {}: {why}", eid.index());
            }
            // FLIPFACE=i turns face i of the result over (a debugging aid).
            if let Ok(i) = std::env::var("FLIPFACE") {
                let i: usize = i.parse().unwrap();
                for f in solid_faces(&topo, r.solid).unwrap() {
                    if f.index() == i {
                        let face = topo.face_mut(f).unwrap();
                        face.set_reversed(!face.is_reversed());
                    }
                }
            }
            let (open, over) = bad_edges(&topo, r.solid);
            if let Ok(out) = std::env::var("OUT") {
                std::fs::write(
                    &out,
                    brepkit_io::step::write_step(&topo, &[r.solid]).unwrap(),
                )
                .unwrap();
            }
            // MESHVOL=d: the signed volume of the solid's mesh at deflection
            // d, and each face's share of it (about the mesh's box centre).
            if let Ok(d) = std::env::var("MESHVOL") {
                let d: f64 = d.parse().unwrap();
                let (mesh, offs) =
                    brepkit_operations::tessellate::tessellate_solid_grouped_with_tolerance(
                        &topo, r.solid, d, 0.5,
                    )
                    .unwrap();
                let mut lo = [f64::MAX; 3];
                let mut hi = [f64::MIN; 3];
                for p in &mesh.positions {
                    for (k, c) in [p.x(), p.y(), p.z()].into_iter().enumerate() {
                        lo[k] = lo[k].min(c);
                        hi[k] = hi[k].max(c);
                    }
                }
                let c = brepkit_math::vec::Point3::new(
                    0.5 * (lo[0] + hi[0]),
                    0.5 * (lo[1] + hi[1]),
                    0.5 * (lo[2] + hi[2]),
                );
                let faces = solid_faces(&topo, r.solid).unwrap();
                let mut total = 0.0;
                for (g, w) in offs.windows(2).enumerate() {
                    let mut share = 0.0;
                    for tri in mesh.indices[w[0] as usize..w[1] as usize].chunks_exact(3) {
                        let [a, b, e] =
                            [tri[0], tri[1], tri[2]].map(|i| mesh.positions[i as usize] - c);
                        share += a.dot(b.cross(e)) / 6.0;
                    }
                    total += share;
                    println!(
                        "   mesh face {} {}: {share:.4}",
                        faces.get(g).map_or(usize::MAX, |f| f.index()),
                        faces
                            .get(g)
                            .map_or("?", |&f| topo.face(f).unwrap().surface().type_tag())
                    );
                }
                println!("mesh volume({d}) {total:.4}");
                return;
            }
            if std::env::var("VOL05").is_ok() {
                let t = std::time::Instant::now();
                let v = brepkit_operations::measure::solid_volume(&topo, r.solid, 0.05);
                println!(
                    "volume(0.05) {v:?} in {:.2}s; faces {}",
                    t.elapsed().as_secs_f64(),
                    census(&topo, r.solid)
                );
                return;
            }
            if let Ok(d) = std::env::var("TESSF") {
                let d: f64 = d.parse().unwrap();
                for f in solid_faces(&topo, r.solid).unwrap() {
                    let t = std::time::Instant::now();
                    let m = brepkit_operations::tessellate::tessellate(&topo, f, d);
                    println!(
                        "   face {} {}: {:.2}s {:?}",
                        f.index(),
                        topo.face(f).unwrap().surface().type_tag(),
                        t.elapsed().as_secs_f64(),
                        m.map(|m| m.indices.len() / 3).map_err(|e| e.to_string())
                    );
                }
                return;
            }
            if let Ok(d) = std::env::var("TESS") {
                for d in d.split(',').map(|d| d.parse::<f64>().unwrap()) {
                    let t = std::time::Instant::now();
                    let m = brepkit_operations::tessellate::tessellate_solid_grouped_with_tolerance(
                        &topo, r.solid, d, 0.5,
                    );
                    if let Ok((mesh, offs)) = &m {
                        for (i, w) in offs.windows(2).enumerate() {
                            println!("   group {i}: {} tris", (w[1] - w[0]) / 3);
                        }
                        // Each open mesh edge (positions welded at 1e-5, as a
                        // consumer would) with the group (face) it is in.
                        let faces = solid_faces(&topo, r.solid).unwrap();
                        let q = |v: f64| (v * 1e5).round() as i64;
                        let mut weld = std::collections::HashMap::new();
                        let vid: Vec<usize> = mesh
                            .positions
                            .iter()
                            .map(|p| {
                                let n = weld.len();
                                *weld.entry((q(p.x()), q(p.y()), q(p.z()))).or_insert(n)
                            })
                            .collect();
                        let mut uses: BTreeMap<(usize, usize), Vec<usize>> = BTreeMap::new();
                        for (t, tri) in mesh.indices.chunks_exact(3).enumerate() {
                            let g = offs.iter().rposition(|&o| o as usize <= 3 * t).unwrap_or(0);
                            for (i, j) in [(tri[0], tri[1]), (tri[1], tri[2]), (tri[2], tri[0])] {
                                let (a, b) = (vid[i as usize], vid[j as usize]);
                                if a != b {
                                    uses.entry((a.min(b), a.max(b))).or_default().push(g);
                                }
                            }
                        }
                        let mut pos = vec![None; weld.len()];
                        for (&k, p) in vid.iter().zip(&mesh.positions) {
                            pos[k] = Some(*p);
                        }
                        for ((a, b), gs) in &uses {
                            if gs.len() != 2 {
                                println!(
                                    "   open x{} face {:?}: {:?} -> {:?}",
                                    gs.len(),
                                    gs.iter()
                                        .map(|&g| faces.get(g).map(|f| f.index()))
                                        .collect::<Vec<_>>(),
                                    pos[*a],
                                    pos[*b]
                                );
                            }
                        }
                        let _ = mesh;
                    }
                    println!(
                        "tess {d}: {:.2}s {:?}",
                        t.elapsed().as_secs_f64(),
                        m.map(|(m, _)| (
                            m.indices.len() / 3,
                            brepkit_operations::tessellate::boundary_edge_count(&m)
                        ))
                        .map_err(|e| e.to_string())
                    );
                }
                return;
            }
            if std::env::var("NOMEASURE").is_ok() {
                println!(
                    "faces {} ({}), {open} open / {over} over-used",
                    solid_faces(&topo, r.solid).unwrap().len(),
                    census(&topo, r.solid)
                );
                for fid in solid_faces(&topo, r.solid).unwrap() {
                    let f = topo.face(fid).unwrap();
                    let n: usize = topo.wire(f.outer_wire()).unwrap().edges().len();
                    let bb = brepkit_operations::measure::solid_bounding_box(&topo, r.solid)
                        .ok()
                        .map(|b| (b.min, b.max));
                    let es: Vec<String> = topo
                        .wire(f.outer_wire())
                        .unwrap()
                        .edges()
                        .iter()
                        .map(|oe| {
                            let e = topo.edge(oe.edge()).unwrap();
                            format!(
                                "e{}{}{}",
                                oe.edge().index(),
                                if oe.is_forward() { "+" } else { "-" },
                                &e.curve().type_tag()[..1]
                            )
                        })
                        .collect();
                    let sz = if let brepkit_topology::face::FaceSurface::Nurbs(s) = f.surface() {
                        format!(
                            "{}x{} deg {}x{} pu {} pv {}",
                            s.control_points().len(),
                            s.control_points()[0].len(),
                            s.degree_u(),
                            s.degree_v(),
                            s.is_periodic_u(),
                            s.is_periodic_v()
                        )
                    } else {
                        String::new()
                    };
                    println!(
                        "  face {} {} rev={} edges {n} {es:?} {sz}",
                        fid.index(),
                        f.surface().type_tag(),
                        u8::from(f.is_reversed())
                    );
                    let _ = bb;
                    if std::env::var("EDGES").is_ok() {
                        for oe in topo.wire(f.outer_wire()).unwrap().edges() {
                            let e = topo.edge(oe.edge()).unwrap();
                            let (a, b) = (
                                topo.vertex(e.start()).unwrap().point(),
                                topo.vertex(e.end()).unwrap().point(),
                            );
                            let (t0, t1) = e.curve().domain_with_endpoints(a, b);
                            let len: f64 = (0..64)
                                .map(|k| {
                                    (e.curve().evaluate_with_endpoints(
                                        t0 + (t1 - t0) * f64::from(k + 1) / 64.0,
                                        a,
                                        b,
                                    ) - e.curve().evaluate_with_endpoints(
                                        t0 + (t1 - t0) * f64::from(k) / 64.0,
                                        a,
                                        b,
                                    ))
                                    .length()
                                })
                                .sum();
                            println!(
                                "      e{} v{}->v{} {a:?} -> {b:?} len {len:.4}",
                                oe.edge().index(),
                                e.start().index(),
                                e.end().index()
                            );
                        }
                    }
                }
                return;
            }
            let vol = brepkit_operations::measure::solid_volume(&topo, r.solid, 0.001)
                .unwrap_or(f64::NAN);
            let area = brepkit_operations::measure::solid_surface_area(&topo, r.solid, 0.001)
                .unwrap_or(f64::NAN);
            let valid = brepkit_operations::validate::validate_solid(&topo, r.solid)
                .map(|v| {
                    if std::env::var("ISSUES").is_ok() {
                        for issue in &v.issues {
                            println!("  issue: {issue:?}");
                        }
                    }
                    format!("{} errors", v.error_count())
                })
                .unwrap_or_else(|e| format!("{e}"));
            if std::env::var("FACES").is_ok() {
                for fid in solid_faces(&topo, r.solid).unwrap() {
                    let face = topo.face(fid).unwrap();
                    let exact = brepkit_operations::measure::face_area(&topo, fid, 0.01)
                        .unwrap_or(f64::NAN);
                    let mesh =
                        brepkit_operations::tessellate::tessellate(&topo, fid, 0.01).unwrap();
                    let mut area = 0.0;
                    for t in mesh.indices.chunks_exact(3) {
                        let [a, b, c] = [0, 1, 2].map(|k| mesh.positions[t[k] as usize]);
                        area += (b - a).cross(c - a).length() / 2.0;
                    }
                    let n_edges: usize = std::iter::once(face.outer_wire())
                        .chain(face.inner_wires().iter().copied())
                        .map(|w| topo.wire(w).unwrap().edges().len())
                        .sum();
                    println!(
                        "  face {} {} rev={} loops={} edges={n_edges} area exact={exact:.3} mesh={area:.3}",
                        fid.index(),
                        face.surface().type_tag(),
                        u8::from(face.is_reversed()),
                        1 + face.inner_wires().len()
                    );
                    if std::env::var("SURF").is_ok_and(|t| t == face.surface().type_tag()) {
                        println!("    {:?} wire rev={}", face.surface(), face.is_reversed());
                        for w in std::iter::once(face.outer_wire())
                            .chain(face.inner_wires().iter().copied())
                        {
                            for oe in topo.wire(w).unwrap().edges() {
                                let e = topo.edge(oe.edge()).unwrap();
                                let (s, t) = if oe.is_forward() {
                                    (e.start(), e.end())
                                } else {
                                    (e.end(), e.start())
                                };
                                let [ps, pt] = [s, t].map(|v| topo.vertex(v).unwrap().point());
                                let uv = |p| face.surface().project_point(p);
                                println!(
                                    "    edge {} {} fwd={} {:?} -> {:?}  uv {:?} -> {:?}",
                                    oe.edge().index(),
                                    e.curve().type_tag(),
                                    oe.is_forward(),
                                    ps,
                                    pt,
                                    uv(ps),
                                    uv(pt)
                                );
                            }
                        }
                    }
                }
            }
            println!(
                "fillet r={radius} in {:.2}s: {} faces ({}), volume {vol:.4}, area {area:.4}, \
                 {open} open / {over} over-used edges, {valid}",
                t.elapsed().as_secs_f64(),
                solid_faces(&topo, r.solid).unwrap().len(),
                census(&topo, r.solid)
            );
        }
    }
    let rf = &case["reference"];
    if !rf.is_null() {
        println!(
            "reference ({}): volume {:.4}, area {:.4}, faces {}",
            rf["by"],
            json_f64(&rf["volume"]),
            json_f64(&rf["area"]),
            rf["faces"]
        );
    }
}
