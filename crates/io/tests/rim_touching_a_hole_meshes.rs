//! A plate whose round outline a hole touches.
//!
//! The mesher samples a plane face's outer arc finer where a hole passes
//! nearer it than its chords sag, so the outline clears the hole. Here a
//! hole meets the arc, 5e-11 of its radius off it: no sampling clears a
//! point that close, and asking for one took 1.4e6 samples, past the
//! mesher's limit, so the part did not mesh at all. It now meshes
//! watertight. The data is written by
//! brepkit's own STEP writer.

#[cfg(test)]
mod tests {
    #![allow(clippy::unwrap_used, clippy::panic)]

    use std::path::Path;

    use brepkit_io::step::reader::read_step;
    use brepkit_operations::tessellate::{is_watertight, tessellate_solid};
    use brepkit_topology::Topology;

    #[test]
    fn a_plate_whose_outline_a_hole_touches_meshes() {
        let path = Path::new(env!("CARGO_MANIFEST_DIR")).join("tests/data/rim_touching_hole.step");
        let mut topo = Topology::new();
        let solid = read_step(&std::fs::read_to_string(path).unwrap(), &mut topo).unwrap()[0];
        for deflection in [0.5, 0.1, 0.01] {
            let mesh = tessellate_solid(&topo, solid, deflection);
            let mesh = mesh.unwrap_or_else(|e| panic!("deflection {deflection}: {e}"));
            assert!(is_watertight(&mesh), "deflection {deflection}: open mesh");
        }
    }
}
