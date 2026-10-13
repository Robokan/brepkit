Fusing a disc into a ring (the disc's rim coincident with the ring's bore) dropped the ring's end faces and failed with "open growth shell".

`sample_face_interior` sized its inward offsets from the outer loop's vertices. A loop of one closed circle has a single vertex, so the box was a point and every candidate stayed within 1e-7 of the rim, failed the containment test, and the fallback took the boundary polygon's centroid. For a ring that is its centre, in its hole, where the disc fused into it reads the ring Inside, so the ring was dropped. Offsets are now sized by the edges' curves too, and a candidate in one of the face's holes is rejected.

Found replaying a downstream CAD app's recorded booleans: two booleans that fell to the mesh fallback now stay exact with the reference's volume.

## Tests

- Added `sample_face_interior_planar_ring_lands_on_the_ring`: the sample of a planar ring bounded by two circles lies on the ring (it was the centre, r = 0, before the fix).
- `cargo test -p brepkit-algo -p brepkit-operations --lib` passes.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
