## Summary

A pocket's rim edge, chamfered between two notches cut off the rim, ends on the notches' walls. Each notch is exactly as deep as the chamfer is wide. The bevel's end triangles reach past the walls, which the blend engine's trimmer cannot close, and the flat-bevel engine refuses the curved body (the plate is drilled). The chamfer failed.

`chamfer_prism::chamfer_by_prisms` is a fallback for separate straight edges. Each edge must be a line between two planes, convex, and ending at each end on a plane square to it that holds its end vertex. No two picked edges may share a vertex. Such an edge's chamfer is exactly the triangular prism its bevel sweeps, so the prisms are cut away. The apex is set 1e-3 of the distance outside the corner so that no film is left along the edge. The result is kept only if every cut is exact (no mesh fallback), the solid is valid, and the volume removed equals the prisms' sections times their lengths within 1e-4. `chamfer` and `chamfer_two_on` try it after the engines they already use fail.

## Tests

- `crates/operations/tests/chamfer_rim_between_notches.rs`: a 100 × 60 × 20 plate with a pocket, two notches 5 deep off the pocket's rim and a bore. The rim edge between the notches is chamfered at 5 (removing 0.5·25·40) and at 5 and 3 (removing 0.5·15·40). Both fail on main.
- The math, topology, algo, blend, operations and io tests pass on this branch.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
