`unify_same_domain` never merged a group of coplanar faces when any of them had a loop made of a single closed edge (a round hole bounded by one full circle). It deferred the whole group, so a plate's face stayed split around a box fused into it whenever the plate also had a round hole, and booleans reported more faces than the solid has.

Three changes let such groups merge:

- A closed edge (start vertex = end vertex) is a loop of its own, so a full-circle hole survives the boundary rebuild instead of breaking the loop chaining.
- Loops are classified as outer or hole by testing a point on each loop's own boundary (the true middle of one of its edges) against the other loops' exact boundaries, with `region2d::point_in_region` over their segments and conic arcs (a fitted curve keeps sampled chords). The old test used the loop's centroid against a polygon of its vertices: a merged outline's centroid can sit inside one of its holes (the new test's plate and tab average exactly to the hole's centre), and a chord polygon misreads anything between an arc and its chords.

Found replaying a downstream CAD app's recorded booleans: 124 results that had the right solid but too many faces now match the reference's face count.

## Tests

- Added `unify_keeps_a_round_hole_where_the_merged_outline_centres` (a 4 × 2 plate with a full-circle hole and a tab beside it, sharing an edge; the merged face must keep the hole as its one inner loop).
- Added `unify_keeps_a_small_hole_close_inside_a_curved_outline` (from review: a unit disc in three sectors with a 0.0002 hole at radius 0.999; a sampled outline merged it into two overlapping faces).
- `cargo test -p brepkit-heal`, `cargo test -p brepkit-operations --lib` and `cargo clippy -p brepkit-heal --all-targets -- -D warnings` pass. The pose sweep and truth audit match `main` line for line.
- `compound_cut_edge_tangent_tools_stays_analytic` fails now and then in a full parallel `--lib` run, on unmodified `main` too (1 run in 3 here); it passes alone. It reads a process-wide fallback counter that other tests' fallbacks can bump.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
