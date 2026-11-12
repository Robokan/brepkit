//! Time `solid_volume` on STEP files, one solid at a time.
//!
//! ```text
//! cargo run --release -p brepkit-io --example measure_step -- <file.step>...
//! ```
//!
//! Prints each file's import time, then each solid's volume and the time it
//! took, at the deflection the BuzzCAD bridge passes (0.05).
#![allow(clippy::unwrap_used, clippy::expect_used, clippy::print_stdout)]

use std::time::Instant;

use brepkit_topology::Topology;

fn main() {
    for path in std::env::args().skip(1) {
        let text = std::fs::read_to_string(&path).expect("read");
        let mut topo = Topology::new();
        let t = Instant::now();
        let solids = match brepkit_io::step::read_step(&text, &mut topo) {
            Ok(s) => s,
            Err(e) => {
                println!("{path} import failed: {e}");
                continue;
            }
        };
        let ti = t.elapsed().as_secs_f64();
        let mut total = 0.0;
        let mut vols = Vec::new();
        for s in solids {
            let t = Instant::now();
            let v = brepkit_operations::measure::solid_volume(&topo, s, 0.05);
            total += t.elapsed().as_secs_f64();
            vols.push(match v {
                Ok(v) => format!("{v:.17e}"),
                Err(e) => format!("err {e}"),
            });
        }
        println!(
            "{} import {ti:.2} volume {total:.3} {}",
            std::path::Path::new(&path)
                .file_stem()
                .unwrap()
                .to_string_lossy(),
            vols.join(" ")
        );
    }
}
