## What

A fillet of a box (or any convex trihedral corner) whose three stripes at a corner differ widely in length now sets the corner back to the rolling ball, as it already did for near-equal stripes. The corner is then a patch of the ball, exact and watertight.

## Why

`set_back_convex_trihedral_stripes` skipped any corner whose longest incident stripe was more than twice as long as its shortest (the near-equal-stripe guard from #1631, named for the 90:60:10 ratio of the cross-one-row fixture). Such a corner kept its stripes untrimmed and was closed by a patch through the sections a radius from the vertex, on a sphere of radius `r * sqrt(2)`. That patch is not the rolling ball, and on boxes with one long side every corner came out wrong:

| box, all twelve edges | radius | before | after | closed form |
|---|---|---|---|---|
| 10 x 10 x 50 | 1 | 2987.18, mesh open | 4941.25, watertight | 4941.25 |
| 33.46 x 27.33 x 111.26 | 2 | 73459.76, mesh open | 101162.98, watertight | 101162.98 |
| 10 x 10 x 20 (within the guard) | 1 | 1967.00, watertight | 1967.00, watertight | 1967.00 |

The "before" volumes are measured on open meshes, so they say little beyond that the corners do not close.

The guard's comment cites a 0.9% volume loss on the cross-one-row fixture with set-backs. With the ball corners now built on the sphere of the rolling ball, that fixture builds all 186 edges with set-backs too, and more of its corners come out as balls (115 against 99).

## How

- The length guard is removed. A corner is set back whenever `convex_trihedral_setback` finds the ball centre on every stripe's bounded centreline.
- A short stripe whose two set-backs meet is refused, as before, by "trihedral setbacks consume an entire stripe", the same refusal as a cube rounded past half its edge.
- Comments that cited the guard now name `convex_trihedral_setback` as what leaves a junction un-set-back.

## Tests

- New `crates/operations/tests/fillet_long_box_corners.rs`: a 33.46 x 27.33 x 111.26 box rounded on all twelve edges at r = 2 has eight ball corners, validates, is watertight, and matches the closed form within 1e-7. It fails before this change: no ball corners.
- `regress_fillet_unset_back_trihedral_corner.rs`: the 90 x 60 x 10 box now has set-back ball corners and its closed-form volume, at r = 0.5 and 0.25. That test pinned the un-set-back contacts before.
- `corner::tests::convex_trihedral_short_rib_sets_back` (was `..._still_skips_setback`) checks that the 90:60:10 stripes are set back to the ball centre.
- `unset_back_junction_classifies_false_and_cap_is_r_sqrt2` still checks the un-set-back classification, on stripes it leaves untrimmed itself.
- `cargo test -p brepkit-blend -p brepkit-operations -p brepkit-io` passes. `cross_one_row_fillet_inmem` also passes.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
