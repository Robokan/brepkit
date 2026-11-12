## What

`chamfer` (the flat-bevel engine) lands each bevel on the two faces of its
edge, at its distance from the edge. If a face reaches no farther than that
distance from the edge, the bevel has no room on it. Take a 100 x 60 x 20 box
with its four top edges chamfered 25: the bevel lands below the sides. The
rebuild still came back as a closed solid that passes validation, with the
wrong volume. At 29.999 the volume is negative: the solid is inside out.

`chamfer_core` now checks each picked edge on each of its faces before it
rebuilds anything. If the face's polygon reaches no farther from the edge
than the chamfer distance (plus the linear tolerance), the chamfer is
refused with `InvalidInput`. A chamfer that exactly consumes a face is
refused too; before, it came back invalid.

## Test

`crates/operations/tests/chamfer_past_its_face.rs` chamfers the box's top
edges:

- At 5, 12.5 and 19.999 the result is valid, and its volume matches the hip
  roof's closed form, LWH - (L + W)d² + 4d³/3, to 1e-9.
- At 20, 25, 29.999, 30 and 35 the chamfer is refused.

Without the change, the refusal test fails.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
