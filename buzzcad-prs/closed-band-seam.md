## Problem

A fillet round a closed rim builds one band face whose wire runs along both contacts and crosses between them twice along one seam edge. That seam was always a straight line. On a round the seam runs across the band, so the line is the chord of the cross-section arc, and it stands off the band by up to `r (1 - cos(θ/2))` for a section of angle `θ`: about `0.29 r` for a right-angled rim.

`validate_solid` does not check that an edge lies on its faces, so the result validated, and brepkit's own mesher meshed the band from its parameters without trouble. A reader that meshes a face out to its boundary edges reads the band out to the chord instead. On a round written to STEP and read back, that showed as about 1% too much area and 0.1% too little volume.

Both closed-band paths mint the seam this way:

- `assemble_closed_rim` (`fillet_builder.rs`): the torus band round a cylinder's or cone's rim on its cap;
- `create_periodic_blend_face` (`builder_utils.rs`): a walked band round any other closed spine.

## Change

`builder_utils::seam_curve` gives the seam as the round's own arc between the two contact points:

- on a torus band, the tube circle through both points;
- on a walked band, the arc of the stripe's cross-section through both.

The arc is the shorter one from the first point to the second, as `cross_section_curve` already gives the end edges of open stripes. The line is kept only when no circle passes through both points within `1e-4 r`. Both paths now take their seam from it.

## Tests

- `fillet_round_rims.rs`'s checker now also requires every edge of the result to lie on each face that uses it, to `1e-6`, at three points inside the edge. This covers the rods, tubes, posts, bores, pockets and frustums there. Without the change it fails on the rod, tube and frustum rims: their straight seams stand 0.10 to 0.21 off their tori.
- `cargo test -p brepkit-blend -p brepkit-operations` passes, and clippy is clean.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
