## Summary

Since a spline edge is divided where it turns (#2428), a spline edge that holds the deflection keeps few samples, and a sharp bend in an edge or a surface can be cut very fine. The meshers read those samples in a face's (u, v), and several readings left imported parts with spline faces open (a few open or over-used mesh edges each) where they were closed before, or put a face's grid points outside the face.

- **Chords that do not hold in (u, v).** A chord holds the deflection in space, which need not hold in a face's (u, v):
  - a face narrower than its sides' chords sag (a sliver between two spline sides running almost together) gets an outline whose chords cross in its (u, v), or a sample lying on another chord, and its mesh loses the triangles past the crossing;
  - on a face whose (u, v) is skewed, a chord's straight line in (u, v) runs far off the edge on the surface, and grid points inside the outline lie outside the face.

  A new pass, `split_crossing_spline_chords`, halves a spline chord on its curve, round by round, wherever it crosses another chord of its face's outline or a sample lies on it, and, on a spline, cylinder or torus face, wherever the surface point at its (u, v) middle, carried by the chord ends' own offsets from the surface (an edge read from a file can stand off its face), stands farther than the deflection from the curve's middle. Only chords that come within their two sags of each other in space are tested for crossing: two chords can cross in (u, v) only there. The solid mesher runs it on its shared samples, so the face across each edge takes the new samples too, and the per-face mesher of a trimmed face runs it on its own.
- **Bends cut too fine.** A span was cut until it turned within half the angular tolerance, so a bend much tighter than the deflection was cut to the depth limit, into samples about 1e-6 apart that project to one point in (u, v). A span shorter than a tenth of the deflection is no longer cut for its turn, on an edge or along a spline face's grid lines; its sag still cuts it. A span whose curve barely moves over part of it (its control points bunched) is still cut by parameter into pieces a hair long, so a break closer than a thousandth of the deflection to the last one kept is dropped.
- **A seam laid on a rim.** A closed face's seam samples keep their projected v only when they lie within the rims' v span. That span comes from the rims' samples, and a closed rim's highest sample can fall short of the seam's vertex (by 5e-5 in one part); with only one rim at a constant v there is no span at all. The seam was then spaced evenly across the span, which put a sample on the rim's vertex, or every sample on the rim. The projected v is now kept within a thousandth of the span, and whenever the span is empty.

`nurbs_edge_sample_params` gives the parameters of a spline edge's samples, in the order `sample_edge` returns them, and `sample_edge_with_params` returns them with the points, so the pass reads them from where the edges were sampled.

The pass keeps each face's projections from round to round and reads again only the faces whose edges a round changed. A chord is held only against chords whose boxes, grown by their sags, meet its own, found by binary search along the outline's widest axis, and a pair with no spline chord in it is never tested. On a part meshed to 628,400 triangles at deflection 0.5, `tessellate_solid` takes 2.83 s against 2.63 s before.

## Tests

- `thin_spline_lens_mesh.rs`: a lens 50 long and 0.075 thick between two cubic sides, one reparameterised by its weights so that its middle sample sits above the other's chord, extruded and made B-splines. It meshes closed at deflections 0.5, 0.25 and 0.1, and to its volume at 1e-3. It fails at 0.5 without the new pass.
- `spline_dome_seam_mesh.rs`: a dome whose wall is one closed B-spline face, its seam run from the pole to its rim and back, closed by a disc. It meshes closed, to the dome's closed-form volume. It fails without the seam change.
- `a_hook_shorter_than_a_tenth_of_the_deflection_is_not_cut_for_its_turn`: a 0.004 hook at deflection 0.5. Its closest samples were 7e-7 apart and are now 1e-4 apart.

algo, operations, blend, io and topology tests pass; clippy is clean; the pose sweep and truth audit match `main` line for line.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
