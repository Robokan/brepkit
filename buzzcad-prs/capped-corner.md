## Summary

Take an extruded profile whose wall `C` meets its end plane `P` and a flat side `Q` at a corner. Round the edge where `P` meets `C`, and the extrusion's edge where `C` meets `Q`. Leave the edge where `P` meets `Q` sharp. The wall meets `Q` at more than a right angle: a trapezoid prism's top edge and the vertical beside its slanted side, say.

Each stripe ended on its own section a radius from the corner, and a corner patch closed the gap between them. That patch is not on either round. The wall's trimmed loop crossed itself, and the mesh was open.

The shape follows from the extrusion. At depth `t` below `P`, the round along `P` is the wall's trace inset by `w = r - sqrt(r^2 - (r - t)^2)`, and the extrusion's round is one fixed circle. So the part's section at that depth is the profile with its wall inset by `w` and the corner cut by that circle. The two rounds meet along a crease. It starts where their contacts on the wall cross and runs round the extrusion round's quarter to `Q`. From there the round along `P` runs on to `Q`, notching it, up to the sharp edge.

The corner is now built that way (`apply_capped_corner` in `corner.rs`, tried before the junction fan):

- the crease and the notch become edges;
- the round along `P` ends on the sharp edge, its contact on `P` rebuilt as an exact circle (or line) to get there;
- both walls and `Q` are trimmed to the new edges, and the edges they replace are retired from the registry.

It only takes the case it can build exactly. Otherwise it leaves the corner to the existing paths:

- `P` and `Q` planar and square to each other;
- the extrusion's round a cylinder along `P`'s normal;
- the round along `P` a torus about that normal or a cylinder across it;
- one straight sharp edge;
- the wall meeting `Q` at more than a right angle.

## Test

`crates/operations/tests/fillet_capped_corner.rs` rounds a trapezoid prism's top edge along `y = 0` and the vertical edge at `(L, 0)`, at r = 1, 2 and 3. The top's slanted edge is left sharp.

Each result must:

- validate;
- mesh watertight;
- have 8 faces, none of them a patch;
- match the volume integrated over the sections above to 1e-7.

Each section's area is in closed form, and the depth integral is Gauss-Legendre over the round's quarter. The error is about 1.5e-10.

Fails on `main` with an open mesh.

A D prism (its top arc and the verticals at the chord's ends, so the round along `P` is a torus) is held back. On `main` it also needs other changes not yet sent.

Blend and operations tests pass.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
