## Summary

The patch test from #2646's review has two B-spline patches lie on each other only where the samples one holds cover a whole cell of its grid. Take two faces of one closed extruded wall, each half of it. They meet only along their two edges, so each holds the other's first and last rows but no cell. They read as crossing, and fusing two pieces of a part back along such a wall fell back.

When every held sample lies on the patch's own edge rows and columns, and the surfaces are tangent at each one (normals within 1e-6 of parallel), the patches now lie on one surface. A patch crossing another along interior grid lines (the wave the rule was added for) still does not.

## Tests

- `same_domain::tests::the_halves_of_a_closed_wall_lie_on_one_surface` (a cylinder's two rational halves).
- `halves_of_a_closed_spline_wall_fuse_exactly` in `crates/io/tests/plane_face_samples.rs` (two pieces of a part, written by brepkit's STEP writer). It falls back on main.
- The math, topology, algo, blend, operations and io tests pass on this branch.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
