Curve, surface and 2D-curve evaluation kept their basis functions in stack buffers sized for degree 8, and indexing past them panicked on a higher degree: a degree-14 B-spline read from a STEP file brought the whole import down. Past degree 8 they now use the heap; the cached surface evaluator, whose buffers are sized the same way, defers to the surface there.

## Tests

- Added `crates/math/tests/high_degree.rs`: a degree-14 curve and a degree-10 surface whose control points are evenly spaced along a line or over a grid (so, by linear precision, each value and derivative is known exactly) evaluate and differentiate correctly instead of panicking.
- `cargo test -p brepkit-math` and `cargo clippy -p brepkit-math --all-targets -- -D warnings` pass.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
