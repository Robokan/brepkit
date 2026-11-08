## What

Two equal rounds along a planar top's outline, meeting at a convex corner whose vertical edge is left sharp, are now mitred at any corner angle. Before, only a square corner was mitred.

## Why

Such a corner that was not square went to the corner patch, which is meant for concave corners. It closed the corner wrongly: on a kite prism up to 3% of the removed volume was left on.

Where both walls stand square to the top along their edges (planes, cylinders or a spline profile's wall, at any angle to each other), the two rounds meet as a moulding mitred at the corner. At depth `t` below the top, each round is its wall's trace inset by `w`, where `(w - r)^2 + (t - r)^2 = r^2`. So the crease runs from the pinch a radius down the sharp edge (`w = 0`) to where the two contacts on the top cross (`w = r`, `t = 0`).

`extruded_mitre` checks the corner: three faces, one sharp straight edge running down the top's normal, both walls square to the top a radius deep along their edges, and convex. It then finds each crease point where the two insets cross, by Gauss-Newton on the two edges' parameters. The contacts' crossing on the top is found the same way (`contacts_crossing`), which converges where they meet at a shallow angle. The crease is laid on both stripes' own surfaces, since a walked stripe runs a little off the exact round.

## Tests

- New `crates/operations/tests/fillet_extruded_mitre.rs`: kite prisms whose corner between the two rounded edges is 60, 75, 120 or 140 degrees, rounded at r = 1 and 2. Each result validates, is watertight, adds only the two round faces (no corner patch), and removes the closed form `2 L r^2 (1 - pi/4) - 2 cot(theta/2) r^3 (5/6 - pi/4)` within 1e-6 of the part. The test fails before this change.
- `cargo test -p brepkit-blend -p brepkit-operations -p brepkit-io` passes.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
