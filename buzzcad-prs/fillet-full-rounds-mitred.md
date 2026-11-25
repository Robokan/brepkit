## What

Two walls meeting at a sharp edge, exactly twice the radius high, rounded along both rims: the mitred corner now builds. It used to fail with a corner failure.

## Why

Take a prism exactly 2r high whose outline turns a convex corner, and round the two edges at the corner along both its top and its bottom. Each wall beside the corner is a full round: its top and bottom rounds' contacts lie on each other at half height, so the wall is left a sliver of two edges, which goes.

At the corner, the top rounds mitre: their crease runs from where the top's contacts cross down to a pinch r below the corner, on the sharp edge between the walls. The bottom rounds mitre the same way, up to a pinch r above the bottom corner. At 2r high the two pinches are one point, the middle of the sharp edge, and nothing of the edge is left.

`apply_equal_two_edge_miter_corner` first adopts the sharp edge, shortened to the pinch by the trim, on both side walls. Here each side wall is a sliver with no such edge, so the adoption failed. The exact-limit closure, which handles a contact collapsed onto the corner, does not apply either, so the corner failed.

## How

When there is no sharp edge to adopt, `shared_sliver_pinch` looks for the case above:
- both side walls are slivers of two edges, with no holes;
- their wires pass through one shared vertex at the pinch.

That vertex is the pinch. The corner then goes on as before: the top contacts are shortened, the top face is spliced, and the crease runs from the pinch to the top. The slivers are dropped later, as any contact sliver is.

## Tests

In `fillet_extruded_mitre.rs`, `a_kite_twice_the_radius_high_mitres_its_full_rounds` builds a kite prism 2r high at 75, 120, 140 and 179.6 degrees, with r = 1 and 2. It rounds the corner's two edges along the top and the bottom. Each result is checked for:
- validity, a watertight mesh and 8 faces (the four rounds added, the two walls gone);
- every edge lying on its faces;
- the volume within 1e-6 of twice what one rim's mitred rounds take off.

The test fails without the change: there is a corner failure at the kite's corner. Blend, operations and io tests pass; clippy and fmt are clean.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
