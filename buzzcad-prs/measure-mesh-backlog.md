Stacked on #2643 (and through it on #2642, #2641 and #2639); the top commit is this PR. It covers measuring and meshing: exact volumes for B-spline and revolved faces, and meshes that close on faces that used to leave cracks or mesh over holes.

## Measure

- **B-spline faces integrated on their surface.** A NURBS face's flux is integrated by Gauss quadrature over each mesh triangle's (u, v), the patch shifted by its corners' offsets so it runs through the mesh's own corners. Flat triangles inscribed a curved wall: -0.17% on an extruded spline profile.
- **The centre of mass and the per-face sums** are taken about the solid's box centre, not the origin. Solids with torus faces keep the old anchor.
- **Cone and torus bands** read their turn from the arcs' own domains (half arcs read the shorter way could sample one side).
- **Revolved bands hold their volume exactly** (a revolved half ellipse, through STEP).
- **A mesh's flux** reads a closed surface a period back.
- Speed: a solid's faces, and a big face's triangles, are integrated on all cores.

## Meshing

- **Holes:** a hole's flood seed steps in from the vertex with the longest shorter edge, passing over hair vertices. A loop closing a hair past its start made a lobe the seed fell in, and the hole was meshed over.
- **Stepped walls:** a cylinder or cone wall with rims at more than two heights goes to the CDT in the developed metric.
- **Curve ends** within a file's tolerance snap to their vertices, circles included. An end 6e-4 off broke a face's outline at one deflection (+6% area).
- **Pointed cones:** every pointed cone's wall is walked from its seam. Walked from a rim, the stretch after the seam was a period off and meshed over area the face doesn't have.
- **Sphere caps:** a cap lying on its side meshes toward its own pole.
- **Spline faces:** spline faces whose chords do not hold in (u, v) are closed. Chords lying along one line in (u, v), the two edges of a sliver on a spline rim, are not halved forever. A boundary point the nearest-point proof gives up on is kept.
- **Band meshes:** the structured band mesh declines a rim that folds back in u. It stitched the fold across, so the right solid meshed to the wrong volume.

## CDT

- A constraint is split at a lone vertex lying on it.
- When neither end of a constraint's corridor flips, any crossing edge with a convex quad is flipped before bisecting (a long slot's side got a Steiner point and the planar mesher fell back to a self-overlapping fan).
- Speed: the edge flip passes over far edges first.

## Tests

- `crates/io/tests/revolve_step_round_trip.rs`
- `crates/io/tests/elliptic_extrusion_step.rs`
- `crates/io/tests/spheroid_cut_one_bspline_face.rs`
- `crates/io/tests/spline_part_coarse_volume.rs`
- `crates/operations/tests/rod_tangent_to_drum_caps.rs`
- `crates/operations/tests/sliver_on_spline_rim_mesh.rs`
- unit tests in `measure::volume`, `tessellate` and `cdt`

The STEP and boolean tests among these come here because they check volumes or closed meshes that need this PR's measure and meshing.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
