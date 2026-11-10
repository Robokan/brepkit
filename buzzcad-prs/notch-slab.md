## Problem

A straight round run on to a curved end face (#2356) notches that face, and `notch_stays_clear` checks the notch against the face's other boundaries. It looks along the band's axis: no other boundary may reach into the triangle between the notch's two ends and the corner.

Seen along the axis, every point straight behind the corner reads as inside that triangle, however far away it is. A bar fused through a wider pin shows this:
- the bar's opening on the far side of the pin is a boundary of the same wall;
- seen along the bar, that opening lies right behind the corner, `2 sqrt(R^2 - W^2)` away;
- a round along the bar's top edge, ending on the pin, was refused ("would cross another boundary of its cap").

The notch is nowhere near that opening.

## Change

`fillet_builder.rs`: on a curved cap, the notch also lies along the axis within a slab:
- the slab spans the notch's two ends and the corner, widened by the band's radius and by the notch's own size (the end curve can bow along the axis as the cap curves);
- a boundary lying wholly to one side of that slab cannot reach the notch, and is passed over.

The test that a boundary lies beyond the slab is certified, as the triangle test is:
- a line, by its two ends;
- a circle or an ellipse, by samples clear of the slab by their sag;
- a B-spline, by its control hull, and only while every weight is positive.

Planar caps are unchanged: the view along their normal is exact.

## Tests

- New `crates/operations/tests/fillet_bar_through_pin.rs`: a bar through a wider pin, the top edge of one arm rounded at r = 1 and 2, with the pin's seam in two places. Each result must be valid and watertight, and the volume taken off must match the strip outside the round out to the pin's wall (closed form, by Simpson's rule) within 1e-6. On `main` it fails: the fillet is refused.
- `fillet_curved_end_caps.rs` passes unchanged, including `a_round_whose_notch_would_cross_a_hole_in_its_curved_cap_is_refused`.
- `cargo test -p brepkit-blend -p brepkit-operations` passes, and clippy is clean.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
