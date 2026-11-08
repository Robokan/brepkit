## Summary

Round both rims of a cylinder wall at once, where one rim's cap is a plain disc and the other's has a hole with a B-spline outline (a puck with a pocket in its top).

The two rims took different paths:

- The disc cap's rim took the closed-rim rebuild (`assemble_closed_rim`). It rebuilds the wall with the round's contact circle in place of the rim, and records the new wall in `face_replacements`.
- The holed cap's rim took the normal trim path, since `closed_rim_info` declines a cap whose holes have B-spline edges. That trim started from the wall as it came. It dropped the rebuild's contact circle, kept the rim the rebuild had replaced, and then overwrote the rebuild's entry for the wall.

So the result's wall still used the old rim, the closed-rim band's contact circle had one use, and the incidence audit refused the fillet.

A rim whose wall a stripe on the normal path also trims now takes the normal path too. The normal path already trims both contacts on one wall. This repeats until no rim changes path, since sending one rim to the normal path can affect another rim on the same wall.

## Test

`crates/io/tests/fillet_two_rims_one_wall.rs` builds a puck of radius 25 and height 20. A pocket is cut 5 deep into its top, its outline one closed B-spline (an ellipse with one control point pushed out, so that it reads back as no conic). The puck is written to STEP and read back, as a file gives the part: a file starts each rim circle at its seam vertex.

Both rims are rounded at once, at r = 3 and 7.5. Each result must:

- validate;
- mesh watertight;
- lose exactly the two rings the rounds remove, to 1e-6.

Fails on `main` at the incidence audit.

Blend, operations, io and algo tests pass.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
