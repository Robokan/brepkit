Importing a ball written as one spherical face bounded by a `VERTEX_LOOP` failed with "failed to create wire from edge loop: empty wire".

Some writers give a whole sphere as a single face whose only bound is a `VERTEX_LOOP`, one point on it. The reader built an empty wire from it. Such a face now reads the way `make_sphere` builds a ball: two hemispheres meeting along a polygon inscribed in the equator about the sphere's axis (32 sides, as the sphere boolean tests use), the representation the boolean engine supports.

Found replaying a downstream CAD app's recorded booleans: two fuses with a ball failed at import, and now match the reference result exactly (volume and area to ten digits).

## Tests

- Added `vertex_loop_sphere_reads_as_hemispheres`: a ball written this way reads as a valid closed solid of two hemispheres with the right volume, and fuses with a box on the exact path. It fails without the fix with the "empty wire" error.
- `cargo test -p brepkit-io` passes.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
