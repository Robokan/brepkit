## Summary

Rounding the rim where an earlier round meets a face, at the earlier round's own radius, puts the rolling ball's centre on the earlier round's axis. The ball touches that round all along a circle and the face at a single point, pivoting there as it rolls, so the new band is a patch of the ball and its contact on the face is a point.

The fillet built that contact as an edge running from the point back to itself, with no length. Such an edge has no sense, so the band and the face could not use it in opposite senses. The orientation passes read it as a fold, and the result failed validation: `1 shared edges have inconsistent face orientations`, and an Euler characteristic off by one.

Before orienting the result, the fillet now drops every closed edge of no length from the result faces' wires and retires its planned boundary. The band and the face then meet at the vertex alone, as they do geometrically.

## Test

`crates/operations/tests/fillet_ball_pivot.rs` rounds a box's vertical corner edge at r = 2, then rounds the top's rim, the arc included, at r = 2 again. The result must validate, and its volume must equal that of the same five edges rounded in one call. The test fails on `main` with the inconsistent-orientation error.

Blend, operations and io tests pass.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
