A bore cut through a plate into a boss fused to its back, tilted slightly off the boss's axis and running just inside its wall, crosses the plate's back face inside the round hole the boss leaves in that face. The closed ellipse there lies wholly off the face, but the exact plane x cylinder trim found no edge crossings and left the section to the sampled restriction, which does not read holes, so it was kept. It split the bore's wall along a curve no face shared, the wall was dropped, and the cut fell back to the mesh boolean.

A closed plane section that crosses none of the plane face's edges, holes included, and whose point lies outside the face's exact outline (its lines and arcs) is now dropped.

## Tests

- Added `crates/operations/tests/bore_just_inside_a_boss.rs`: a plate, boss and flange, cut by a bore 2.3 degrees off the boss's axis, in four seam turns; the cut is exact, valid and at its closed-form volume.
- `cargo test -p brepkit-algo -p brepkit-operations` and `cargo clippy -p brepkit-algo --all-targets -- -D warnings` pass.
- `compound_cut_edge_tangent_tools_stays_analytic` fails now and then in a full parallel `--lib` run, on unmodified `main` too; it passes alone (it reads a process-wide fallback counter that other tests' fallbacks can bump).

🤖 Generated with [Claude Code](https://claude.com/claude-code)
