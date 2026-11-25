## Summary

A B-spline edge read from STEP is often a piece of a longer curve, and its vertices can stand off that curve by up to the edge's tolerance. `EdgeCurve::domain_with_endpoints` took a piece only when both ends projected within the weld band, 1e-5. With an end past it, the edge was read as the whole curve, from end to end. The faces that edge bounds then took in area past their vertices, and the solid's exact volume went with them.

In the part that showed it, a degree-7 section curve with 98 control points bounds a plane face and a small B-spline face. One vertex stands 1.2e-5 off the curve (3.8e-5 on the mirrored edge), and the curve runs on 3.6 mm past the other. The plane face read 4.2 mm² too large, each B-spline face 0.7 too large (16%), and `solid_volume` came out 106 mm³ light on 5340.5, 2%. A reference kernel measures the same file at 5340.51; with this change brepkit measures 5340.46.

On an open curve that runs on past the edge's vertices by more than a hundredth of the edge, both ends within a file's edge tolerance (a new `FILE_EPS`, 1e-4) now read at their projections. The tighter checks still run first, and off-curve ends past 1e-4 still fall back to the whole curve.

A curve that ends just past its vertices still reads whole. In `wing_rib_ends.step` (#2861's test part) a curve runs 1.6e-4 past a vertex 4.5e-5 off it, on an edge 0.059 long. Read at the projections, the part gets that vertex's tolerance from the 4.5e-5. Scaled by 25.4, the vertex stands 1.2e-3 off, past `FILE_EPS`, so the edge reads whole and its gap is 4.1e-3, past the tolerance. Read whole in every scale, the gap and the tolerance scale together.

## Tests

- `edge::tests::nurbs_domain_ends_a_file_s_tolerance_off_the_curve_are_trimmed`: one end of a sub-span on the curve and the other 4e-5 off it, in both directions. It fails on main: the full domain is returned.
- `nurbs_domain_off_curve_endpoints_fall_back_to_full_domain` still passes: ends 0.5 off read whole.
- `step_curve_end_gaps.rs` still passes in all four poses; without the run-on condition its scaled pose fails.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
