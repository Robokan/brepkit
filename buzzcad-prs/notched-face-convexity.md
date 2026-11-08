## Summary

Stacked on #2335, which this test needs: the round's top end is capped inside the wall, which runs on above it.

The plane/plane round tells a concave edge from a convex one by which side of the other face's plane each face lies on. It read that side from the face's farthest vertex.

On a wide face notched at the edge, that vertex can be on the wrong side. One example is a wall that runs past a step:

- a pocket is cut into a block's corner, under a groove across the block's whole width;
- so the pocket's back wall and the groove's wall are one face;
- beside the edge, that face runs away from the pocket's side wall;
- but its far end reaches past that wall's plane on the other side.

The round then read a concave edge as convex. It built its cylinder mirrored through the edge, its axis in the material rather than in the pocket's corner.

The side is now read at the edge itself. For each face, the round takes the direction from the edge into the face, as the face's wire runs the edge (the surface normal × the edge's tangent, at the edge's middle). It checks that direction against the other face's normal. The farthest vertex still decides where no wire of the face runs along the spine's edge.

The helper that gives this direction (`into_face_from_edge`) already decided convexity for curved stripes in `fillet_builder.rs`. It moves to `builder_utils.rs` so that both can use it.

## Test

`crates/operations/tests/fillet_concave_edge_of_a_notched_wall.rs` builds the part above. It rounds the pocket's corner edge at r = 1 and 2, with the part unturned and turned 0.7 rad about z.

Each result must:

- validate;
- mesh watertight;
- have its one round's axis a radius out from both walls, in the pocket;
- add the corner's volume, (1 - π/4) r² along the edge.

Without the change it fails on the axis: (19, 9) for (21, 11).

Blend, operations, io and algo tests pass.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
