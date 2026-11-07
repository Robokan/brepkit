## What

A radius past a sharp mitre's limit by no more than the linear tolerance now builds as the limit does. Before, the admissibility check refused it with `RadiusTooLarge`.

## Why

`check_equal_two_edge_admissibility` refused a radius past an edge's length by any amount, however small. A file stores lengths to its own digits, so an edge drawn exactly as long as the radius can read a few 1e-12 short of it.

The case that showed it is a 28 mm edge with a mitre at each end, read back as 27.999999999986 mm. A round of 14 on it was refused with `max_radius = 13.999999999993`.

The three comparisons in the check (the contour's length against `m * r`, the retained third edge, and the runout terminal's edges) now allow `TOL` (1e-7) over. A radius in that band is at the limit, and the collapsed-corner construction (`close_collapsed_miter_corner`) already builds the limit.

## Tests

- `regress_two_edge_exact_limit.rs`: new `a_radius_a_files_digits_past_the_limit_builds_as_the_limit`. The inch cube at r = S + 1e-11 and S + 1e-9 builds a valid, closed, outward solid at the limit's closed-form volume. It fails before this change with `RadiusTooLarge { max_radius: 25.4 }`.
- The existing control at r = S + 1e-6 is still refused, with the source unchanged.
- `cargo test -p brepkit-blend -p brepkit-operations` passes, and clippy is clean. (`compound_cut_edge_tangent_tools_stays_analytic` can fail in a full parallel run on this machine, with or without this change, because it reads a process-wide fallback counter. It passes when run alone.)

🤖 Generated with [Claude Code](https://claude.com/claude-code)
