Since #2307, the touching-pieces gate can refuse pieces that only touch, when the gap beside one of their faces narrows to nothing where they meet. A rod with a shallow flat along its side and a block whose hollow follows the rod's round over the flat meet only along the flat's two edges, but the fuse falls back to the mesh boolean: a faceted, approximate result where the exact one was right.

## Cause

The gate's outside witness is one point per face, a step past the mesh's sag out from the centroid of the face's largest triangle. A face pressed against another piece has that piece on its outer side all over, so any one point would do. A face that only touches another piece along an edge can have a gap beside it that narrows to zero at that edge, like the lens between the flat and the hollow. Where the largest triangle sits near the edge, the gap there is thinner than the step, the far witness lands in the rod, and the face reads as pressed against it.

## Change

`boolean/mod.rs`:

- The point just inside each face stays at its largest triangle.
- The points just outside are taken off up to 8 triangles spread over the face (the largest first), each pair stepped along its own triangle's normal.
- A face reads as pressed against another piece only when every such pair has a point in another piece. So one clear pair, anywhere on the face, is enough to show the pieces don't share it. The builder splits faces along every section, so a face is pressed against another piece all over or not at all.

## Tests

`pieces_meeting_along_a_flat_s_edges_only_touch`: the rod and the block from primitives, with flats 0.03, 0.065 and 0.1 deep, each turned four ways about the rod's axis. Without the change it fails on the first pose, a flat 0.03 deep with no turn. The existing touching-pieces tests still pass, including the thin stacked plates and the rod pressed into a tube's bore.

## Verification

- `cargo test -p brepkit-operations --lib` passes.
- Clippy is clean.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
