## Problem

A fillet along a closed rim where a flat face meets a B-spline wall failed or came out wrong. This is a plate cut from a spline outline, its wall one B-spline face closed round the outline. Five faults stacked up along the way:

- The spine measured each edge by the chord between its ends, which is zero for a closed edge, so the walk got no length ("contour stripe failed: empty input").
- The walker's surface parameters ran off the closed wall's domain at its seam, and the cross-sections stopped converging (stripe residual failure).
- The side the ball rolls on was read only for planes. Against a curved wall the walker took the surface's own normal, which can face into the material, so the ball rolled outside the wall.
- Steps were sized by arc length alone. Round a tight bend of the outline the sections stood far apart in angle, and the band cut corners.
- The band round a closed spine uses its seam edge twice. The normal pass (`normalize_face_normals`) skips such faces, so the band kept whichever normal its sections gave it. That normal can face into the solid: the result validates, but it meshes inside out and its volume reads wrong.

## Change

- `spine.rs`: each edge's length is measured along its curve: exact for lines and circles, summed from 256 chords for ellipses and NURBS.
- `walker.rs`:
  - Parameters on a surface closed in u or v wrap by whole periods after each Newton update. The predictor steps the short way round.
  - A new `WalkerConfig::max_turn` (0.025 rad) halves a step whose section plane turns further than that, down to a floor of 1e-3 of the span.
- `traits.rs`: `ParametricSurface` gains `closed_u` / `closed_v` (default `None`; a periodic `NurbsSurface` gives its domain). `FlippedNormalSurface` forwards them.
- `fillet_builder.rs`:
  - The ball's side on either face is read at the middle of the spine's first edge, for curved faces too. A face that has to be flipped is wrapped in `FlippedNormalSurface`, as planes are flipped through `orient_plane_surface`.
  - The walker now goes all the way round a closed spine, so a band too wide for its faces can now be built (before, the walk failed first). A closed spine's contacts are therefore checked against each face's extent, and a contact past its face is refused.
  - After the orientation passes, a seamed face built by the fillet is turned to face as the neighbours it meets tangentially do. Only faces already settled vote. The turn reverses the wire and toggles the edge senses and the reversal flag, so shared edges keep their senses.
- `fillet/rolling_ball.rs`: the deprecated rolling-ball engine refuses a closed edge before building. Its end-of-build guard caught these only while the walker's cross-sections failed on a closed edge. The dispatcher falls through to the next engine as before.

## Tests

- New `crates/operations/tests/fillet_spline_rims.rs`: a slab with an elliptic outline (8 x 5, 4 thick), its wall one closed B-spline face. Each rim is filleted at r = 0.5, 1 and 2, and each result must:
  - be valid;
  - mesh watertight;
  - lose the strip a fillet removes, to 0.1%. That strip is the section `(1 - pi/4) r^2` swept along the outline offset in by its centroid.
- Updated, since closed rims are now refused before building:
  - `rolling_ball_rejects_closed_rim_so_dispatcher_falls_through` checks the new reason;
  - `cross_one_row_fillet_inmem` replaces a diagnostic of the old collapsed result with a check that the refusal leaves the topology untouched.
- `cargo test -p brepkit-math -p brepkit-blend -p brepkit-operations -p brepkit-io` passes, and clippy is clean.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
