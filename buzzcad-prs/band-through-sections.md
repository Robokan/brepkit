## Summary

Stacked on #2347, which this test needs: without it the band faces into the part and the mesh does not close.

A walked round (a fitted band between two faces that have no closed-form round) is built from the sections the walker leaves along the spine. `approximate_blend_surface` took those sections as the band's control points. A B-spline only passes through its control points at its ends, so along a curved edge the band cut inside the sections. One example is a round along a quarter turn of a B-spline rim:

- the band's contact on the wall stood inside the wall;
- the part came out 0.2 light at r = 1, about 3% of the volume the round takes off.

The band now interpolates its sections (`interpolate_blend_surface`). Each section's arc is a rational quadratic, and the arcs are interpolated along the spine in homogeneous coordinates, with averaged knots. Their parameters run on by the farthest that the ball's centre or either contact moves from one section to the next. Taking the centre alone would give a step of zero where the ball turns about a still centre (a round of a rim at the round's own radius), and such a band still interpolates.

Where interpolation is refused, the band is built on its sections as before.

## Test

`crates/operations/tests/fillet_band_through_sections.rs` builds a prism on a quarter sector whose arc is one parabolic B-spline span, and rounds the arc's top edge at r = 1 and 2.

Each result must:

- validate;
- have six faces;
- mesh watertight;
- take off the corner's volume to 1e-4 of it: (1 - π/4) r² along the edge, less (5/6 - π/4) r³ for each radian the edge turns.

Without the change it fails at r = 1: volume 1992.90 for 1993.11, 6.89 taken off.

Topology, blend, operations, io and algo tests pass.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
