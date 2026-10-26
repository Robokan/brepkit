Stacked on #2072 (two-distance chamfers); review that first. This PR adds one commit on top of it.

A chamfer's end is closed by splicing its cross edge into the end face's detour round the corner. Where an end face's straight edge was left in pieces (as a boolean can leave it) and the chamfer reaches past the piece at the corner, that detour passes more vertices than the corner, and only a two-edge detour was accepted: the chamfer was refused as a trimming failure. The shortest run between the two contact points is now taken.

## Tests

- Added to `crates/operations/tests/two_distance_chamfers.rs`: a box whose end edges are in pieces 4 from its front corners, both front corners chamfered past those pieces; valid and at its closed-form volume. It fails without the fix.
- `cargo test -p brepkit-blend -p brepkit-operations` and `cargo clippy -p brepkit-blend -p brepkit-operations --all-targets -- -D warnings` pass.
- `compound_cut_edge_tangent_tools_stays_analytic` fails now and then in a full parallel `--lib` run, on unmodified `main` too; it passes alone (it reads a process-wide fallback counter that other tests' fallbacks can bump).

🤖 Generated with [Claude Code](https://claude.com/claude-code)
