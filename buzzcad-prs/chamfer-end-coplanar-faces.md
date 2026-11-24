## What

A chamfer whose edge ends at an inside corner shared by two end faces in one plane now leaves those two faces as one.

## Why

Take a strip on a floor running into a post that rises above it, with a slab beside the post. Chamfer the edge between the strip's top and its wall. At the strip's end the edge meets the post's side above the top and the slab's end beside the wall. Both lie in one plane, square to the edge.

The chamfer bares a triangle of that plane between them. One side of the triangle runs along the post's side, the other along the slab's end. `splice_inside_corner` spliced the triangle into one of the two faces and left the other beside it: two faces of one plane, facing the same way, sharing an edge. The result was valid and its volume was right, but it had one face too many at each such end. For comparison, a reference kernel's result of the same chamfer has one face there.

## How

- `splice_end_face` now returns the face it spliced the triangle into.
- `merge_coplanar_beside` then looks for the face that holds the triangle's other side.
- If that face lies in the same plane and faces the same way, the two are merged:
  - their outer wires are joined round the shared edge;
  - the other face's holes are carried over;
  - the other face is dropped from the result's faces.
- The faces are left alone when they share more than that one edge, or when the joined outline would pass a vertex twice.
- `close_chamfer_ends` and `splice_inside_corner` take the face list mutably so that the merged face can be dropped.

## Tests

`chamfer_into_a_two_face_corner.rs` builds the strip, post, slab and floor from boxes, then chamfers the strip's edge two ways: 3 on the top and 2 on the wall, and 9 on the top and 7 on the wall. In the second, the wall's distance is its whole height, so the wall goes too. Each result is checked for:
- validity, and a watertight mesh;
- the volume it lost, equal to the bevel's prism, d1 d2 / 2 times the edge's length;
- one face in the corner's plane;
- the expected face count.

The test fails without the change: there are two faces in the corner's plane. Blend, operations and io tests pass; clippy and fmt are clean.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
