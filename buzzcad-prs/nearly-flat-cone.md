## Summary

`ConicalSurface::project_point` read `v` as the point's height over the apex divided by the sine of the half angle. A point off the cone by `d` moves that `v` by `d cot a`, which is huge on a nearly flat cone. Some STEP writers store a flat annulus as a cone 1e-7 from a plane. That cone's apex stands off the annulus's plane by as much as the angle tilts it, so a point of the annulus read a `v` up to 30% long. The cone's flux was read far too large: a part measured 33409 where it is 38488. Chamfer cones 0.1 to 0.75 degrees off flat, with boundary points a file's tolerance off them, measured parts up to 13% large.

Where the sine is under 0.05 (within 3 degrees of flat), `v` is now the foot on the nearer generator line through the point's angle, `h sin a + r cos a`, negative past the apex. That is the point's own `v` on the cone, and it does not divide by the sine. Steeper cones keep `h / sin a`, which callers read as the cone's level at a point's height, for points well off the cone too. Taking the foot on every cone broke a walked round on an 80 degree cone and the shared-apex cone section.

## Tests

- `a_nearly_flat_cone_projects_points_along_its_generator` in `crates/math/src/surfaces/tests.rs` (a cone 1e-8 from flat, points at radii 10, 15 and 21: `v` within 1e-6, and `evaluate` round-trips). It fails on main.
- The math, topology, algo, blend, operations and io tests pass on this branch.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
