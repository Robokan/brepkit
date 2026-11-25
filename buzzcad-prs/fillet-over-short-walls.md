Builds on #2846 (the plane cut through mitred rounds), which this needs for the plate's cut. Review that first; this branch holds its commit.

## What

`fillet_v2` now rounds a prism cap's whole rim when the radius is larger than the walls are tall. The ball rolls over the floor's rim, and the walls go. Before, the blend engine refused these edges.

## Why

Take a plate 6 thick and round its top outline at r = 8. A ball of radius 8 touching the top and a side would touch the side 8 down, below the floor, so the blend engine refuses the edges. A ball can still roll touching the top and passing over the floor's rim. Its centre is r below the top and s = sqrt(r² − (r − h)²) in from the side, h being the walls' height. The side goes whole, and the round runs from the top down to the floor's outline.

## How

`fillet_short_wall.rs` builds that round from pieces the kernel already has, when the builder fails:

- `short_walled_cap` checks that the picked edges are exactly the outer rim of a plane cap with no holes. The solid has no inner shells and exactly one floor: a plane parallel to the cap and facing away from it, with no holes. Every other face is a plane square to the cap or a cylinder along its normal. The walls are shorter than the radius.
- The cap is extruded down by h + r, and the solid is offset outward by δ = r − s and moved back by δ along the normal, so its top lies in the cap's plane.
- That prism's top rim is rounded by `FilletBuilder`. A ball touching the top and a set-out wall has its centre r below the top and r in from that wall, which is s in from the original wall: the round wanted.
- A box beyond the floor's plane is cut away, which leaves the round passing through the floor's outline. The result is checked with `validate_solid`.

The walls meet at the plate's corners in sharp edges, so the rounds meet there in mitres, as `FilletBuilder` makes them. Any failure in the construction returns the builder's original error.

## Tests

`fillet_over_a_short_wall.rs`:

- `a_plate_rounded_past_its_thickness`: a 120 × 80 × 6 box, its top outline rounded at r = 8. The expected volume is counted on a grid: the straight runs' sections along the outline, plus four mitred corners where a point is kept only if both runs keep it. It fails without the change, because the blend engine refuses the edges.
- `a_disc_rounded_past_its_thickness`: a disc of radius 60, 25 thick, its top rim rounded at r = 27.5. The removed volume is integrated by Pappus. Upstream already builds this one by another path, so it is a guard.

Each result is checked for validity, a watertight mesh, under 20 faces, and its volume within 1e-4. Algo, operations, blend, io and topology tests pass; clippy and fmt are clean.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
