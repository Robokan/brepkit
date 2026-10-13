A planar face whose STEP loops are all plain `FACE_BOUND`s imported with its hole as its outer boundary.

`FACE_OUTER_BOUND` is optional (ISO 10303-42), and some writers give every loop as a plain `FACE_BOUND`, a drilled plate's hole first. The reader took the first bound as the outer one, so the hole became the face: its mesh cracked (224 open edges on a 50 mm washer), its volume read wrong, and booleans on it fell to the mesh fallback. A planar face with no `FACE_OUTER_BOUND` now takes the loop of largest area as its outer bound (its edges sampled, so arcs count); other surfaces keep the first bound.

Found replaying a downstream CAD app's recorded booleans: three pin-into-plate fuses now stay exact, with the reference's volume.

## Tests

- Added `hole_first_face_bounds_read_rim_as_outer`: a drilled plate written with plain FACE_BOUNDs, hole first, reads back valid with the right volume. It fails without the fix.
- `cargo test -p brepkit-io` passes.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
