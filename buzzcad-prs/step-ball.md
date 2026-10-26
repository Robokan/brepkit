Some writers write a ball, or a revolved lemon-shaped body, as a single B-spline face that closes round one direction and collapses to a pole at each end of the other, bounded by nothing but a vertex loop. With no edge to bound it, the face read as "ADVANCED_FACE has no bounds" and the file failed to import.

Such a face now reads as the lunes `revolve` builds for a full turn: the surface is sliced along meridians where it is only C0 (knots raised to full multiplicity, so the slices are exact), and each slice is a face between two meridian edges running from pole to pole. A B-spline surface that is exactly a sphere reads as that sphere, through the existing whole-sphere path.

## Tests

- Added `crates/io/tests/ball_as_one_bspline_face.rs`: a sphere and a prolate spheroid, each written as one rational B-spline face bounded by a vertex loop, read as one valid solid at its closed-form volume with a closed mesh.
- `cargo test -p brepkit-io` and `cargo clippy -p brepkit-io --all-targets -- -D warnings` pass.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
