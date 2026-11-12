## What

`chamfer` (the flat-bevel engine) writes every face of the result from its
corners. A body with a curved edge anywhere is therefore refused with "the
planar chamfer cannot rebuild a curved edge", even when the picked edges
are straight and nowhere near the curve. A drilled plate is an example:
its outer edges are straight, but its hole makes every chamfer of it fail.

Such a body now goes to the blend engine's chamfer (`chamfer_v2` with the
distance on both faces). That is what `chamfer_two_on` already does with
the edges it doesn't cut itself. The blend engine leaves the faces it
doesn't touch as they are, holes and curves included. Bodies whose faces
are all straight-edged still take the flat-bevel rebuild, as before.
Closed circular rims and tangent chains of lines and arcs still take their
own paths first.

On straight edges of such bodies, a reference kernel's results and these
agree to four decimals in volume and area, with the same face counts.

## Test

`crates/operations/tests/chamfer_beside_a_hole.rs` drills a box through
its top and chamfers the box's two long top edges at 2, 4 and 9.5, both
upright and turned. Each result:

- is valid;
- has a watertight mesh;
- takes off d² per unit length of edge, which matches the closed form to
  1e-6.

Without the change, the chamfer is refused.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
