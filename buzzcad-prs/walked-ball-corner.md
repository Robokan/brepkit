## What

Three walked rounds of one radius meeting at a convex corner of three curved faces are now set back to their common ball, and the corner is a patch of the ball's sphere.

Two rounds that meet in line on a curved edge between two faces are fixed too: both faces' trims now split that edge at the same points, so the rounds share one section.

## Why

Take a plate whose outline is two B-spline sides meeting at shallow kinks. When its rims and the kink edges are rounded at one radius, three walked rounds meet at each corner. Only rounds of straight edges between planes were set back to their ball, through the planes' offsets (`convex_trihedral_setback`). Walked rounds ran on to the corner vertex and crossed each other. The corner's boundary then made a figure eight with five contact points, and the build failed: "corner failure at vertex".

The plate's side walls are also split at mid-height, as in a part fused from two halves, and that split is a B-spline curve. The upper and lower kink rounds' contacts end on it. A junction's spokes, the edges both faces' trims split where a contact ends, were straight edges only. So each wall half's trim made its own vertex on the split. The two rounds' sections at mid-height were never shared, two slivers of plane closed them, and the shell had edges whose faces disagreed in orientation.

## How

- `walked_setback` (new) finds the ball:
  - It starts from the closest approach of two rounds' walked centrelines (the polylines through their sections' centres).
  - It refines the centre by Newton on the three faces' surfaces, until it is the radius from each.
  - It is taken only when it lies within 1e-3 of the radius of every round's centreline, inside its walk.
- `set_back_convex_trihedral_stripes` uses this when all three rounds at a junction are walked bands. Their end radii must match.
- Each round is cut back to its exact section through the ball. It keeps its sections beyond and is rebuilt through them (band, contacts and pcurves), as `pivot_crossing_rounds` rebuilds a pivoted round.
  - A band built in pieces, about a contact's crossing cut out, is rebuilt in the same pieces. They are found from the full-multiplicity knots at its joins.
  - In one piece, such a band folded, and the flat face's outline crossed itself.
- The corner then takes the existing set-back path: its three end sections are great circles of the ball, so it is a patch of the ball's sphere.
- `tangent_junction_spokes` also returns curved (B-spline) spokes, with their curves. The trimmer's spoke check takes any piece of one, both ends on its curve; straight spokes are read as before.

## Tests

`fillet_kinked_plate_corners.rs` uses such a plate, read from STEP and rounded at r = 30. The file's plate has two bores; the test leaves them out (the top and bottom take their outlines alone), so it checks the rounds alone.
- The four kink edges alone: valid and watertight, the plate's top and bottom the only planes.
- The kinks and the rims together: valid and watertight, a sphere patch at each of the four corners, each of radius 30 and centred 30 below the top or above the bottom.
- Both fail without the change: the first leaves the two slivers, the second fails at a corner.
- Blend, operations and io tests pass; clippy and fmt are clean.

Stacked on #2724, whose commit is the first here: without it, one rim band's winding is misread at a sample where the band's partial vanishes, and the result's faces point inward. It drops out of this diff when #2724 lands.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
