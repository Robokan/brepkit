//! Time brepkit's boolean on a set of exported corpus cases.
//!
//! Each argument is a case directory (`case.json`, `input0.step`,
//! `input1.step`, as a replay exports them). Inputs are read once; the
//! boolean then runs `REPEAT` times (default 5) on copies of them, and the
//! median is kept, so the time is the operation alone with its inputs
//! loaded. Cases whose inputs hold several solids are skipped. Prints one
//! line per case and a summary.
//!
//! ```sh
//! cargo run --release -p brepkit-io --example corpus_bench -- <case dir>...
//! ```
#![allow(clippy::print_stdout, clippy::expect_used, clippy::unwrap_used)]

use std::path::Path;
use std::time::Instant;

use brepkit_operations::boolean::{BooleanOp, BooleanOptions, boolean_with_options};
use brepkit_topology::Topology;

fn main() {
    let repeat: usize = std::env::var("REPEAT")
        .ok()
        .and_then(|v| v.parse().ok())
        .unwrap_or(5);
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
        if a.len() != 1 || b.len() != 1 {
            continue;
        }
        let mut runs: Vec<f64> = (0..repeat)
            .map(|_| {
                let mut copy = topo.clone();
                let t = Instant::now();
                let _ = boolean_with_options(&mut copy, op, a[0], b[0], BooleanOptions::default());
                t.elapsed().as_secs_f64()
            })
            .collect();
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
