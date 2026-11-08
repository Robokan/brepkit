## Summary

A round's closed contact can run over a hole in a curved face. Take a rod whose top is cut on a slope, so its top rim is an ellipse and the round is walked, and which is cross-drilled just below the top. Round the rim, and the contact on the wall runs round it about a radius below the rim. If the bore reaches above that, the contact runs over the bore's holes in the wall.

The trim keeps the wall's holes whole. So the wall's trimmed outline and its hole cross: for a stretch, the outline runs inside the hole. The face is valid by edge count, and brepkit's own measures read about right. But the face has no inside there, and another kernel, reading the result back from STEP, could not mesh the wall and measured it 0.26% light.

The hole guard (`check_holes_clear_of_closed_contacts`) already refuses this on a plane face, by comparing the curves in the plane's frame. It returned early for every other surface. On those faces it now compares the curves in space, with `check_holes_clear_in_space`. A closed contact that a hole's edges come within reach of is refused: within the distance both curves can stray from their sampled polylines, plus the vertex tolerance. A hole whose rim the contact itself rounds is exempt, as on a plane. A hole wholly on the side the trim cuts off is not tested on curved faces, since that needs the face's own frame.

## Test

`crates/operations/tests/fillet_round_rims.rs` cuts a rod of radius 5 with a plane rising 0.3 along x, and drills it across along y. Its elliptic top rim is then rounded at r = 2. Where the bore meets the wall, the contact runs about 2 below the rim, at z = 5.

- `a_rods_top_rim_round_over_a_bore_in_its_wall_is_refused`: bores at z = 5.2 (radius 0.5) and z = 4.7 (radius 0.4) reach above the contact. Both must be refused. The test fails on `main`, where the first is built.
- `a_rods_top_rim_rounds_off_above_a_bore_in_its_wall`: a bore at z = 3 stays clear. The round must build, validate and mesh watertight, and take off exactly what it takes off the rod without the bore.

Blend, operations, io and algo tests pass.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
