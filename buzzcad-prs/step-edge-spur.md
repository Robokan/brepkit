## Summary

Stacked on #2335.

A round whose width lands exactly on a step: a block's edge is rounded where a notch cut into one of its faces stops a radius from the edge. The round's contact on that face then runs along the notch wall's own straight edges, and on through the face past them.

The trim kept the face beyond the contact. Its wire ran down the notch's edges and back up the whole contact, a spur of no area. That is closed by edge count, but the contact's one long edge lay beside the notch wall's pieces, so the mesh was open along them.

This is the spur `fold_spoke_spurs` folds, with two differences:

- The long edge may be a B-spline lying on its chord. The plane/plane round's contacts are fitted.
- The patch beyond the short edge is the input's own face, not a runout patch carrying on the face beyond. Here the short edge is one of the input's edges and the long one an edge the fillet made.

That second condition now also admits the fold. It runs one edge at a time, so a contact over a wall edge in several pieces folds piece by piece: each fold leaves the rest of the contact as a new edge, and the next piece folds under it. The round then meets each face beyond the wall along its own edge.

## Test

`crates/operations/tests/fillet_round_along_step_edge.rs` rounds the edge of a 40 x 20 x 20 block at r = 6, with a notch 6 from the edge, in two variants:

- one notch, so the wall's edge along the contact is one piece;
- a deeper notch under it, so the edge is in two pieces.

Each result must:

- validate;
- mesh watertight at 0.5 and 0.05;
- match the closed-form volume to 1e-9.

Both fail without the change (open mesh).

Blend, operations, io and algo tests pass.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
