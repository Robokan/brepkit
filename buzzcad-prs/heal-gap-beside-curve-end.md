## Summary

`heal::cover_curve_end_gaps` (#2861) raises a vertex's tolerance to the gap between it and its edge's curve end, but not when the gap is a tenth of the edge's size or more: such a vertex is taken to lie on another part of the curve.

Some files have B-spline edges far shorter than their tolerance: 0.01 to 0.03 long, with vertices standing 2e-3 to 4e-3 to the side of the curve's ends, in parts a few hundred long. Those gaps are past a tenth of the edge, so the vertices keep their tolerance, and `validate_solid` reports the curve as missing its vertices. A fillet anywhere on such a part is then refused, though the round is nowhere near the short edge.

A gap past a tenth of the edge is now raised too when all of these hold:
- the edge is an open B-spline;
- the gap is under 1e-4 of the faces' extent (the diagonal of their vertices' box) and under the edge's size;
- the vertex's nearest point on the curve lies within a quarter of the edge's span from the end it bounds.

A vertex read on another part of the curve still fails the last test, and a gap that is large for the part still fails the second. #2861's test of a gap of 0.25 on a 2 long edge is still refused, since its part is too small for that gap.

## Tests

- `heal::tests::a_short_edge_s_vertices_beside_its_curve_take_the_gap_as_their_tolerance`: a 0.03 x 200 x 200 box whose 0.03 edge is a cubic standing (0, 7e-4, -3.9e-3) to the side of its vertices, in three poses. Both vertices take the gap (about 4e-3) as their tolerance, and the validator no longer finds the curve missing them. It fails on main: the vertices keep their tolerance.
- The other `heal` tests pass, among them #2861's.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
