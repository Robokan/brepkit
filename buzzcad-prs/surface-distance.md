The edge–face crossing scans in `phase_ef` ask for a point's distance to the face's surface at every sample of every edge whose box meets the face (65 samples per edge, plus the on-surface check and the refinement steps). For anything but a plane, `distance_to_surface` projected the point onto the surface (`atan2` and friends) and evaluated the surface back at the foot, then measured.

A cylinder's distance is the point's distance from the axis less the radius, and a sphere's is its distance from the centre less the radius. Those are the same values without the round trip, so `distance_to_surface` now computes them directly; other surfaces keep the projection.

Measured on a benchmark of 147 booleans recorded from a downstream CAD app (single core, inputs already loaded), the median boolean got 13% faster (a typical part is planes and cylinders, and these scans were about a third of its time). Results are unchanged: the pose sweep and truth audit match `main` line for line.

## Tests

- Added `closed_form_distances_match_the_projection` (a cylinder and a sphere placed off the axes; 30 points inside, outside and near each must give the same distance both ways, within 1e-9).
- `cargo test -p brepkit-algo -p brepkit-operations --lib` and `cargo clippy -p brepkit-algo --all-targets -- -D warnings` pass.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
