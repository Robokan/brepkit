//! Time brepkit's boolean on a set of exported corpus cases.
//!
//! Each argument is a case directory (`case.json`, `input0.step`,
//! `input1.step`, as a replay exports them). Inputs are read once; the
//! boolean then runs `REPEAT` times (default 5) on copies of them, and the
//! median is kept, so the time is the operation alone with its inputs
//! loaded. Inputs of several solids run solid by solid as the bridge
//! runs them (`multi`). Prints one
//! line per case and a summary. `FALLBACK=0` declines the mesh fallback
//! (`BooleanOptions::mesh_fallback`), so a case that needs it errors in the
//! time its exact attempt takes. A thread is started before anything is
//! timed (`THREADED=0` does not): see `main`.
//!
//! ```sh
//! cargo run --release -p brepkit-io --example corpus_bench -- <case dir>...
//! ```
#![allow(clippy::print_stdout, clippy::expect_used, clippy::unwrap_used)]

use std::path::Path;
use std::time::Instant;

use brepkit_operations::boolean::{BooleanOp, BooleanOptions, boolean_with_options};
use brepkit_operations::measure::solid_bounding_box;
use brepkit_topology::Topology;
use brepkit_topology::explorer::solid_faces;
use brepkit_topology::solid::SolidId;

fn main() {
    // A process that has never started a thread allocates without locks;
    // the app always runs threads, and parallel steps start them, so a
    // thread is started first and every build is timed alike. THREADED=0
    // leaves the process single-threaded.
    if std::env::var("THREADED").map_or(true, |v| v != "0") {
        std::thread::spawn(|| {}).join().ok();
    }
    let repeat: usize = std::env::var("REPEAT")
        .ok()
        .and_then(|v| v.parse().ok())
        .unwrap_or(5);
    let opts = BooleanOptions {
        mesh_fallback: std::env::var("FALLBACK").map_or(true, |v| v != "0"),
        ..BooleanOptions::default()
    };
    let mut times: Vec<(f64, String)> = Vec::new();
    for arg in std::env::args().skip(1) {
        let dir = Path::new(&arg);
        let Ok(text) = std::fs::read_to_string(dir.join("case.json")) else {
            continue;
        };
        let case: serde_json::Value = serde_json::from_str(&text).unwrap();
        let op = match case["params"]["mode"].as_str() {
            Some("fuse") => BooleanOp::Fuse,
            Some("cut") => BooleanOp::Cut,
            Some("intersect") => BooleanOp::Intersect,
            _ => continue,
        };
        let mut topo = Topology::new();
        let mut read = |name: &str| {
            let text = std::fs::read_to_string(dir.join(name)).ok()?;
            brepkit_io::step::read_step(&text, &mut topo).ok()
        };
        let (Some(a), Some(b)) = (read("input0.step"), read("input1.step")) else {
            continue;
        };
        let mut runs: Vec<f64> = (0..repeat)
            .map(|_| {
                let mut copy = topo.clone();
                let t = Instant::now();
                if a.len() == 1 && b.len() == 1 {
                    let _ = boolean_with_options(&mut copy, op, a[0], b[0], opts);
                } else {
                    let _ = multi(&mut copy, op, &a, &b, opts);
                }
                t.elapsed().as_secs_f64()
            })
            .collect();
        // OUT=<dir>: the result written as STEP, to compare builds by.
        if let Ok(dir_out) = std::env::var("OUT") {
            let mut copy = topo.clone();
            let ids = if a.len() == 1 && b.len() == 1 {
                boolean_with_options(&mut copy, op, a[0], b[0], opts)
                    .map(|r| vec![r])
                    .unwrap_or_default()
            } else {
                multi(&mut copy, op, &a, &b, opts)
            };
            let key = dir.file_name().unwrap().to_string_lossy().into_owned();
            let text =
                brepkit_io::step::write_step(&copy, &ids).unwrap_or_else(|e| format!("error {e}"));
            std::fs::write(Path::new(&dir_out).join(format!("{key}.step")), text).unwrap();
        }
        // VOL=1: the inputs' and the result's volumes and the result's validity.
        if std::env::var_os("VOL").is_some() {
            let mut copy = topo.clone();
            let ids = if a.len() == 1 && b.len() == 1 {
                boolean_with_options(&mut copy, op, a[0], b[0], opts)
                    .map(|r| vec![r])
                    .unwrap_or_default()
            } else {
                multi(&mut copy, op, &a, &b, opts)
            };
            let vol = |t: &Topology, ids: &[brepkit_topology::solid::SolidId]| -> f64 {
                ids.iter()
                    .map(|&s| {
                        brepkit_operations::measure::solid_volume(
                            t,
                            s,
                            std::env::var("VOLDEF")
                                .ok()
                                .and_then(|v| v.parse().ok())
                                .unwrap_or(1e-3),
                        )
                        .unwrap_or(f64::NAN)
                    })
                    .sum()
            };
            let valid = ids.iter().all(|&s| {
                brepkit_operations::validate::validate_solid(&copy, s).is_ok_and(|r| r.is_valid())
            });
            #[allow(clippy::print_stderr)]
            {
                eprintln!(
                    "{} a {:.4} b {:.4} result {:.4} ({} solids, valid {valid})",
                    dir.display(),
                    vol(&topo, &a),
                    vol(&topo, &b),
                    vol(&copy, &ids),
                    ids.len()
                );
            }
        }
        runs.sort_by(f64::total_cmp);
        let median = runs[runs.len() / 2];
        let key = dir.file_name().unwrap().to_string_lossy().into_owned();
        println!("{key} {median:.6}");
        times.push((median, key));
    }
    let total: f64 = times.iter().map(|t| t.0).sum();
    let mut sorted: Vec<f64> = times.iter().map(|t| t.0).collect();
    sorted.sort_by(f64::total_cmp);
    if !sorted.is_empty() {
        println!(
            "cases {} total {total:.4} s median {:.6} s",
            sorted.len(),
            sorted[sorted.len() / 2]
        );
    }
}

fn boxes_meet(topo: &Topology, x: SolidId, y: SolidId) -> bool {
    let (Ok(p), Ok(q)) = (solid_bounding_box(topo, x), solid_bounding_box(topo, y)) else {
        return true;
    };
    let pad = 1e-6
        * [p.min, p.max, q.min, q.max]
            .iter()
            .flat_map(|v| [v.x().abs(), v.y().abs(), v.z().abs()])
            .fold(1.0, f64::max);
    let c = |v: brepkit_math::vec::Point3| [v.x(), v.y(), v.z()];
    let (a0, a1, b0, b1) = (c(p.min), c(p.max), c(q.min), c(q.max));
    (0..3).all(|i| a0[i] <= b1[i] + pad && b0[i] <= a1[i] + pad)
}

/// Bodies of several solids, as BuzzCAD's bridge takes them
/// (`engine._multi_boolean`): a fuse joins solids whose boxes meet, group
/// by group; a cut takes each cutter from each solid its box meets; an
/// intersection keeps each pair's common part.
fn multi(
    topo: &mut Topology,
    op: BooleanOp,
    a: &[SolidId],
    b: &[SolidId],
    opts: BooleanOptions,
) -> Vec<SolidId> {
    let mut out = Vec::new();
    let empty = |topo: &Topology, s: SolidId| solid_faces(topo, s).map_or(true, |f| f.is_empty());
    match op {
        BooleanOp::Fuse => {
            let mut groups: Vec<Vec<SolidId>> = Vec::new();
            for &s in a.iter().chain(b) {
                let (touching, rest): (Vec<_>, Vec<_>) = groups
                    .into_iter()
                    .partition(|g| g.iter().any(|&t| boxes_meet(topo, s, t)));
                groups = rest;
                let mut merged = vec![s];
                merged.extend(touching.into_iter().flatten());
                groups.push(merged);
            }
            for g in groups {
                let mut acc = g[0];
                for &s in &g[1..] {
                    match boolean_with_options(topo, BooleanOp::Fuse, acc, s, opts) {
                        Ok(r) => acc = r,
                        Err(_) => break,
                    }
                }
                out.push(acc);
            }
        }
        BooleanOp::Cut => {
            for &s0 in a {
                let mut s = s0;
                for &c in b {
                    if boxes_meet(topo, s, c) {
                        let Ok(r) = boolean_with_options(topo, BooleanOp::Cut, s, c, opts) else {
                            break;
                        };
                        s = r;
                        if empty(topo, s) {
                            break;
                        }
                    }
                }
                if !empty(topo, s) {
                    out.push(s);
                }
            }
        }
        BooleanOp::Intersect => {
            for &s in a {
                for &c in b {
                    if boxes_meet(topo, s, c)
                        && let Ok(r) = boolean_with_options(topo, BooleanOp::Intersect, s, c, opts)
                        && !empty(topo, r)
                    {
                        out.push(r);
                    }
                }
            }
        }
    }
    out
}
