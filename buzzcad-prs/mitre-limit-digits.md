## What

A radius past a sharp mitre's limit by a file's digits now builds as the limit does. Before, the admissibility check refused it with `RadiusTooLarge`.

## Why

`check_equal_two_edge_admissibility` refused a radius past an edge's length by any amount, however small. A file stores lengths to its own digits, so an edge drawn exactly as long as the radius can read a few 1e-12 short of it.

The case that showed it is a 28 mm edge with a mitre at each end, read back as 27.999999999986 mm. A round of 14 on it was refused with `max_radius = 13.999999999993`.

The three comparisons in the check now allow a consumed length up to `LIMIT_SLACK` (5e-10) of the edge's length past it. They are the contour's length against `m * r`, the retained third edge, and the runout terminal's edges. A radius in that band is at the limit, and the collapsed-corner construction (`close_collapsed_miter_corner`) already builds the limit.

The allowance is relative, and half the 1e-9 that the cap's crossing test (`terminal_cap_is_notchable`) takes, so a radius the check admits is one the build takes. A flat 1e-7 admitted `S + 3e-8` on the inch cube, which the crossing test then refused. The allowance is on the consumed length, not the radius, because that overshoot is how far the fillet's end runs past the edge's far vertex, which is what the crossing test measures.

## Tests

- `regress_two_edge_exact_limit.rs`, new `a_radius_a_files_digits_past_the_limit_builds_as_the_limit`: the inch cube at r = S + 1e-11, S + 1e-9 and S + 4e-10 S builds a valid, closed, outward solid at the limit's closed-form volume. It fails before this change with `RadiusTooLarge { max_radius: 25.4 }`.
- New `a_radius_just_over_the_allowance_past_the_limit_refuses`: r = S + 6e-10 S is refused with `RadiusTooLarge`, with the source unchanged.
- The existing control at r = S + 1e-6 is still refused, with the source unchanged.
- `cargo test -p brepkit-blend -p brepkit-operations` passes, and clippy is clean. (`compound_cut_edge_tangent_tools_stays_analytic` can fail in a full parallel run on this machine, with or without this change, because it reads a process-wide fallback counter. It passes when run alone.)

🤖 Generated with [Claude Code](https://claude.com/claude-code)
