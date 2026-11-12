Stacked on #2379, whose `has_curved_edge` it uses; the first commit here is #2379's.

## What

`chamfer_two_on` sent every edge that is not a rim to the blend engine's
chamfer. That engine cannot close two chamfers that meet at a corner: all
four of a box's top edges chamfered with two distances failed with
`TrimmingFailure`. The equal-distance `chamfer` rebuilds a body of planes
with flat bevels, which handles those corners.

The flat-bevel rebuild now takes a reference face per edge
(`ChamferDistances::Referenced`: `d1` on the edge's reference face, `d2` on
its other face). When the blend engine refuses a body with no curved edge,
`chamfer_two_on` rebuilds it this way. Bodies the blend engine handles are
unchanged, as are bodies with curved edges.

## Test

`crates/operations/tests/chamfer_box_top_two_distances.rs` chamfers a
68 x 154 x 21 box's top edges, `a` on the top and `h` down the sides:
(3, 16), (16, 3) and (5, 5), plus a turned and moved copy. Each result must
be valid and watertight, have 10 faces, and take off
`h (a (W + D) - 4 a^2 / 3)` to 1e-9 of the box's volume. Without the change,
every case fails with `TrimmingFailure`.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
