## What

A round that ends on a flat cap now notches the cap even when one of the cap's two edges at the corner is a B-spline, for example the rim of a wall extruded from a spline profile. Before, the cap had to have straight edges on both sides.

## Why

`terminal_cap_is_notchable` and `notched_wire_edges` accepted only `Line` corner edges. On a prism whose profile is closed by a spline, a round along a straight vertical edge ends on the top and bottom caps. Each cap's edges at that corner are one line and one B-spline.

The notch was refused there. The round's end was closed by a runout patch instead, and the result's mesh was open at both caps.

With this change:

- The corner check takes B-spline edges.
- The contact-end test projects the contact's end onto the spline. It requires the end to lie on the spline within 1e-5, inside the edge's span.
- The notch splices the section arc across that corner, as it does across two straight edges.

## Tests

- New `crates/operations/tests/fillet_spline_cap_corners.rs`. The prism is closed by an interpolated cubic that is not a conic, so extrude cannot turn the wall into an analytic surface. The test rounds the edge where the flat side meets the spline wall, at r = 0.5 and 1, and checks:
  - the result is valid and its mesh is watertight;
  - it has one more face than the prism;
  - the volume removed is the height times the corner's cross-section area, computed numerically (fillet centre by bisection, Green's theorem round the region), within 1e-5 relative.
- The test fails without this change: the mesh is open at the caps.
- `cargo test -p brepkit-blend -p brepkit-operations` passes, and clippy is clean.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
