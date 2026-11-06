## Problem

Rounding both faces' outlines of a slab at once (every edge of the top and of the bottom) put two contacts on every side face. The trim of a face with several contacts splits only edges at a notchable terminal vertex, so the side faces kept their vertical edges whole. Two kinds of junction then went wrong.

- **A square corner.** The two straight fillets meet in the sharp mitre, which expects the trim to have shortened the retained vertical edge to where the side contacts end on it. With the edge whole, `adopt_side_face_vertical_edge` found nothing to adopt and the fillet failed with a corner failure.
- **A straight side running on round an arc**, tangentially (a tombstone outline). The two fillets end on one section. But each side face's trim made its own vertex where its contact ends on the smooth edge between them, so the two stripes registered twin cross-section arcs. The gap between them was closed by a runout patch of no area: a flat bilinear patch whose curved edges do not lie on it, and an out-and-back spur along the uncut edge. The result validated, but another reader healed it into several shells and read the solid inside out.

On top of that, a part read from a file is square only to the digits it stores. Planes written to eight or nine digits leave cosines near 1e-8 between faces that are meant to be square, and the mitre asked for 1e-10. So the corners of such a part took the runout path instead: horn-torus corners with the same spurs.

## Change

- `trimmer.rs`: `BoundarySplitPolicy::Selective` gains `spokes`, straight edges given by their two ends. A trim splits any straight piece of a spoke where a contact ends on it, whatever the contact count. The test is geometric, so a piece left by an earlier face's split still counts (an edge with a mitre at each end is split twice).
- `fillet_builder.rs`: the spokes are each sharp mitre's retained edges, plus `corner::tangent_junction_spokes`.
- `corner.rs`:
  - `tangent_junction_spokes` returns the straight edges, other than the stripes' own, at every two-stripe junction whose stripes end on one section (same centre and contact points to 1e-6). Split there, both side faces end their contacts on one vertex. The second stripe then adopts the first's cross-section edge, and `junction_cross_sections_closed` builds no patch.
  - The mitre's right-angle tests (fan normals, edge directions, convexity) take cosines up to `SQUARE_COS = 1e-7`.

## Tests

- New `crates/operations/tests/fillet_slab_outlines.rs`: a tombstone slab (a semicircle on a rectangle) with both outlines rounded at once (8 edges).
  - Built in memory at r = 1 and 3, and turned and moved far from the origin with its points stored to eight digits.
  - Each result must have 14 faces (5 planes, the wall, 6 straight and 2 round fillets, no corner patch), be valid and watertight, and match the closed-form volume to 1e-5.
  - Without the change, the in-memory slab's fillet returns an error, and the stored one comes out with corner patches.
- `cargo test -p brepkit-blend -p brepkit-operations -p brepkit-io` passes, and clippy is clean.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
