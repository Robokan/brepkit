The STEP writer wrote every `EDGE_CURVE` with `same_sense = .T.`, even for an edge stored against its curve.

A fitted (NURBS) edge can run from its curve's end back to its start: a piece of a closed intersection loop stored that way, or any edge whose vertices are the other way round from the curve's parameterization. brepkit reads such an edge correctly (`domain_with_endpoints` returns a descending span), but written with `.T.` another reader takes the curve from the edge's start vertex onward. On a closed loop that is the other way round the loop, and the part it reads back is a different solid. The writer now asks `domain_with_endpoints` for the edge's span and writes `.F.` when it runs down. Lines, circles and ellipses are unchanged (their vertex order already encodes the sense).

Found replaying a downstream CAD app's recorded booleans: six results that brepkit computed exactly read back wrong in another kernel until this was fixed.

## Tests

- Added `nurbs_edge_against_its_curve_is_written_against_it` (the test cube with one edge replaced by a degree-1 NURBS running from the edge's end to its start; exactly one `EDGE_CURVE` must be written `.F.`). It fails without the fix.
- `cargo test -p brepkit-io` and `cargo clippy -p brepkit-io --all-targets -- -D warnings` pass.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
