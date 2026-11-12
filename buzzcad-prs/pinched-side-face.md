## What

A round whose width lands exactly on a step in the middle of its side face
left that face pinched shut along a strip of no width. Take a U-shaped part:
two uprights joined by a floor exactly a radius thick, with its long bottom
edges rounded. On each side face, the round's contact runs along the floor's
top edge, and that edge lies wholly inside the contact. The side face's wire
then ran along that edge and, further on, back along the contact over it.
The result was two uprights joined by a strip of no width. Counting edges,
the shell is closed. In the mesh it is open: the side face's mesh skips the
strip, while the floor's top face meshes along the edge.

`split_pinched_faces` handles this after `fold_spoke_spurs`:

- It splits the contact at the step edge's two ends, and the round takes the
  step's edge in place of the middle piece, so the round meets the floor's
  top face along that edge.
- The side face's wire now runs the step's edge both ways. It is cut there
  into its two regions, and each region becomes a face of its own.

`fold_spoke_spurs` already folds this spur when the short edge sits at one end
of the long one. This change handles the short edge lying inside it.

## Test

`crates/operations/tests/fillet_floor_one_radius_thick.rs` builds the U part
with a floor exactly a radius thick and rounds its bottom edges, both upright
and turned. It checks that the result:

- is valid;
- has 14 faces;
- has a watertight mesh at 0.5 and 0.05;
- has the closed-form volume to 1e-9.

Without the change it fails on the face count. With the round thinner than
the floor, the side faces stay whole: a guard.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
