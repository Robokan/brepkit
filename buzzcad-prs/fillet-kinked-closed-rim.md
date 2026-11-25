## What

A closed B-spline rim whose curve meets itself at an angle (an outline drawn as one curve, its start and end tangents apart) can now be rounded. It used to fail, or leave the result open.

## Why

The rim's two ends are one vertex, where the outline turns a corner. A round walked once round the rim starts on a section square to the outline's start tangent and ends on one square to its end tangent. Those are two different arcs, so the band closes on neither. On a plate 36 thick whose outline turns 2.6 degrees there, rounded at r = 6, the cap contact overshot its start by 0.27, and the incidence audit refused the result.

The wall beside such a rim is one B-spline face closed round the outline, its seam running down from the corner. So there is a face on both sides of the corner, but the same face, and the corner solver needs two.

## How

`kinked_rim::split_kinked_rims` runs before planning. For each picked closed B-spline rim whose end tangents differ by more than 1e-3 rad, it:

- cuts the rim at its parameter's middle;
- cuts its wall (a B-spline face with no holes, ruled straight across the rim) along the ruling from there, the edge across the wall split where the ruling ends on it;
- splits the wall's surface there too, so each piece has a surface of its own that ends at the corner.

The halves are picked in the rim's place. Each is now an edge between its own wall and the cap, so they are two contours. At the rim's vertex they meet beside the seam line as rounds of two edges at an extrusion's corner do: mitred at a convex corner, pivoted through a horn torus at a reflex one. Halfway round they meet across the ruling at a tangent joint, where they share a section. A ruling cut from one rim may cut another picked rim (both rims of one wall); the pick list follows those cuts. A rim with no such wall is left whole.

## Tests

- `crates/operations/tests/fillet_kinked_closed_rim.rs`: a slab whose outline is an ellipse's B-spline with its end control point pushed out (a tip) or in (a dimple), one rim or both rounded at r 0.5 and 1. It checks validity, a watertight mesh and the face count. The volume removed is checked against the smooth round's (Pappus: the section swept along its centroid's path) within `r^3` times the corner's angle per rim.
- `crates/io/tests/fillet_kinked_spline_plate.rs`: the 36 thick plate above, read from STEP (`tests/data/kinked_spline_plate.step`), its wall split at half height, both rims rounded at r = 6. It checks validity, a watertight mesh, 10 faces and the volume removed as above.

Both fail without the change.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
