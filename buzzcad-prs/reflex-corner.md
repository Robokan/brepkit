## Summary

Two rounds along a face's outline can meet where the outline turns in (a reflex corner), with the edge between their two walls (concave) left sharp. Take the end face of an arch whose whole outline is rounded. At each corner of the channel's ceiling, the ball rolling along one edge pivots on the sharp concave edge and rolls on along the other. The rounds join through a horn torus about that edge, which pinches to a point on it a radius below the face.

So the concave edge has to end at the pinch. The trim never split it there, because only a mitre's retained edge was in the trim's spokes. Each wall then ran on along the edge to the corner and back, and the corner torus ran out to the corner and back along two stub edges. The faces met along slivers of no width: closed by edge count, so valid, but open in the mesh (25 open mesh edges on one part), and brepkit's own volume read 7.5e-4 too large.

The spokes now take the straight sharp edge left at every two-stripe junction. A mitre's retained edge is the convex case of the same edge. The corner torus then comes out as the three-arc triangle the horn-torus builder makes, and the walls as plain quads.

## Test

`crates/operations/tests/fillet_reflex_corner.rs` builds an arch (a block with a channel through it) and rounds, at r = 1 and 2:

- the channel's three top edges;
- the whole top outline;
- the whole top and bottom outlines, so that each concave edge pivots at both ends.

Each result must validate, mesh watertight, and match a closed-form volume. Each straight round takes off `r^2 (1 - pi / 4)` along its edge, each convex square corner gives back `2 r^3 (5 / 6 - pi / 4)` (as in `fillet_extruded_mitre.rs`), and each reflex corner's pivot takes off `(pi / 2) (5 / 6 - pi / 4) r^3`.

The third case fails on `main` with an open mesh.

Stacked on #2335: on `main` without that PR, the both-ends test still fails with this change.

Blend, operations and io tests pass.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
