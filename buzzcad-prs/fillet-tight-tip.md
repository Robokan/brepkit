## Summary

Rounding a plane cap's closed rim on a wall square to it, at a radius larger than the outline's tightest convex bend, was refused: "the fillet's contact on face N turns back on itself ... the radius is larger than the face's bend there". The round touches the cap the radius in from the outline. That inset runs backwards at such a tip and crosses itself, so no ball rolls round the tip. Another kernel's result rounds such rims, and this change builds the same shape.

The round now carries on round each tip and is cut off where it folds back over itself:

- **Before the build** (`tight_tip::split_tight_rims`, next to the kinked-rim pre-pass):
  - for each picked closed B-spline rim between a plane cap and a B-spline wall square to it, find where the inset crosses itself: sample it, take the runs where it goes backwards, then solve the crossing by Newton;
  - split the rim at the two feet of each crossing;
  - round only the pieces between the tips.

  A tip across the wall's seam is left alone, so that rim is refused as before.
- **After the build** (`tight_tip::round_tips`): each tip is still sharp, closed by a triangle in each end section. Both are replaced by two faces that carry the round on, from each foot to where the outline bends tightest. These faces are interpolated through exact sections, as walked bands are.
  - The two faces meet along the crease where the round crosses itself. At depth `theta` down the section, the round's plan is the outline inset by `r (1 - sin theta)`. So the crease runs from the crossing on the cap down to where that inset stops crossing itself: `sin theta = 1 - bend / r`.
  - Below the crease they meet along the section through the tightest bend.
  - The wall carries on along the round's contact, and the cap passes the tip at the crossing alone.

The free `build_in_place` now runs both pre-passes and the tip rounding around the builder.

## Tests

- `crates/operations/tests/fillet_tight_tip.rs`: an elliptic slab (8 x 5, so it bends to 3.125 at the ends of its major axis), one rim and both rims, at r 3.25 and 3.5.
  - Checks: valid, watertight at 0.01, 9 or 15 faces, and the removed volume within `1e-3 r^3` a rim of Pappus' smooth round (the bands' volume is read from their mesh; with an exact band measure it agrees to `1e-4 r^3`).
  - A second test puts a tip across the wall's seam and checks that it is refused.
- `crates/io/tests/fillet_tight_tip_plate.rs`: a 22 mm plate read from STEP (`tests/data/tight_tip_plate.step`, written by brepkit's own writer).
  - Its outline bends to 7.46 at two tips. Both rims are rounded at r = 8.
  - Checks: valid, 16 faces, watertight at 0.05, and volume within `1e-3 r^3` a rim of Pappus.
  - The other kernel's result of this part agrees to 3e-5 in area and 1.1e-4 in volume.

The rounding tests fail on this branch's base with the refusal above; the seam test is a guard and passes there too.

Stacked on #2876, whose helpers in `kinked_rim.rs` this uses.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
