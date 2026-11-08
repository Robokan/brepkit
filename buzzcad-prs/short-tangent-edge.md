## Summary

A face's outline can run on round a short edge tangent to its neighbour, then turn a convex corner. Round the whole outline and the rounds of the side before the short edge and the side past the corner meet as the two rounds of one corner, crossing a setback from it.

With a radius past the short edge's length, that crossing lies beyond the short edge, on the earlier side's contact. The trim ends each contact on its own neighbour's, so it never cut there. The face came out as a loop crossing itself, with a lobe walked backwards. The shell still closed over it, so the result validated and meshed watertight, but it was not the part: a reference kernel read one such part, a plate 400 thick rounded at r = 100 on both outlines, as inside out.

Such a fillet is now refused. On a plane face, two contacts whose edges share no vertex may not cross when a round between them shares a vertex with each and runs on tangent from one of them. Rounds that turn a corner on either side of the short edge are left alone. Their crossings are the trim's ordinary business, and existing fixtures rely on them.

## Test

`crates/operations/tests/fillet_short_tangent_edge.rs` builds a prism whose top outline runs along a straight side, on round a 2 mm B-spline leaving it tangent, then up to the far side. It rounds the whole top outline:

- at r = 1 and 2, within the short edge: the result must validate, mesh watertight, and keep its top face's loop from crossing itself;
- at r = 4 to 8, past it: the fillet may refuse, but must not return a top face whose loop crosses itself.

The second test fails without the change: the r = 4 result's top face crosses itself.

Blend, operations, io and algo tests pass.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
