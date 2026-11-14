## Summary

A trimmed B-spline face's exact volume is Green's theorem along its boundary: the integral of F dv, where F(u, v) integrates the surface from the start of u through each knot span. An edge that is the surface's own side v = 0 or v = 1 has dv = 0 all along it. Each of its points still took that whole integral, and its integrand, rounding alone, need not settle, so the adaptive rule could halve it to its depth.

A wall extruded 1 mm from a 70-span spline and trimmed by a boolean took 7 s a face to measure: 1.9 million evaluations on its two spline edges, against 192 on its two straight ones, which give the whole answer.

- Such edges are now passed over. They are matched to the side as the whole-face path (`nurbs_face_over_domain`) already matches them; that test, `is_side`, moves into a function of its own, unchanged.
- Only terms that are zero are dropped. Of 171 volumes of imported parts and boolean results, 168 come out the same to the last bit; 3 differ in the 15th or 16th digit, the rounding those edges added.

## Speed

Measured one at a time on 57 slow-to-measure boolean results and their inputs:

| | before | after |
|---|---|---|
| the results' volumes | 120 s | 57 s |
| the four worst | 10-14 s each | 10-18 ms each |
| the inputs' volumes (not reached by this) | 81 s | 79 s |

## Test

`a_trimmed_extruded_wall_reads_its_straight_edges_alone`: a wall extruded from a 75-point degree-5 spline, trimmed across it, against a Gauss rule over its (u, v), area and volume to 1e-10.

math, check, operations, io, algo, blend and topology tests pass; clippy is clean; the pose sweep and truth audit match `main` line for line.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
