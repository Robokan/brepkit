## Summary

`domain_with_endpoints` reads a piece of a shared B-spline from the projections of its two ends, each within 1e-5 of the curve; otherwise it reads the whole curve.

A plane section of a part read from a file runs to the part's own vertices. Those stand off the section by the file's tolerance: 5e-5 to 7.5e-3 on the test's B-spline walls. The section's two pieces, split at a point on it, each read as the whole curve, running through the other's vertex. The caps and a wall bounded by them measured next to nothing. A fuse that read as exact lost a third of its volume (99040 where it should be 143258).

On an open curve, where one end lies on the curve and the other lies near one of the curve's own ends (within a hundredth of the piece's chord, and at least 1e-4), the piece now runs to that end. When both ends are off the curve, the piece still reads as the whole curve.

## Tests

- `edge::tests::a_piece_to_a_vertex_off_the_curve_s_end_ends_there`.
- `section_pieces_ending_at_a_file_s_vertices_fuse_exactly` in `crates/io/tests/plane_face_samples.rs` (a rib fused onto a B-spline part, written by brepkit's STEP writer). It gives 99040 on main.
- The math, topology, algo, blend, operations and io tests pass on this branch.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
