Stacked on #2641 (which is stacked on #2639): the commits below the top one are those PRs'. This one is the STEP reader and writer fixes and one revolve fix that this fork's later boolean, measure and meshing fixes build on. The next PRs in the stack add those.

## STEP reader

- **Spheres keep the file's frame.** A sphere face is read in the frame its file gives it, and is written back the same way, so its latitudes and poles read back as they were, where its rims fit that frame:
  - a cap whose seam runs up to its frame's pole is read about its rim;
  - a holed sphere face whose frame is off its own rim is read about +Z;
  - a cap bounded by a circle and a vertex loop is framed about the circle's axis, toward the vertex.
- **A ball or lemon written as one B-spline face** bounded only by vertex loops reads as lunes between meridians, and an exact B-spline sphere reads as a sphere. Before, it was "ADVANCED_FACE has no bounds".
- **A surface of revolution whose seam lies on its own copy of the profile** reads its side from the profile.
- **A linear extrusion of an ellipse** reads as its B-spline sweep. Before, it was `UnsupportedEntity`. A swept conic's surface covers only its face's arc.
- **A ball cut beside its axis** (one B-spline face, its pole's vertex loop and a cut rim) keeps all but the cap.

## STEP writer

- A NURBS edge running against its curve is written with `same_sense = .F.`. Some readers took the long way round the loop otherwise.
- A sphere is written in its own frame, not about +Z.

## Revolve

- A profile arc whose centre lies within a millionth of its radius of the axis is centred on the axis, so the band is the exact sphere. A sketch drawn about a tilted axis lands that far off, and it got the NURBS band, which measured a few parts in a million out.

## Tests

- `crates/io/tests/step_surface_of_revolution.rs`
- `crates/io/tests/revolve_step_round_trip.rs`
- `crates/io/tests/pin_mouth_step_roundtrip.rs`
- unit tests in `step::reader`

The elliptic extrusion's and the cut ball's own tests fuse and mesh their parts, so they come with the boolean and meshing PRs further up the stack.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
