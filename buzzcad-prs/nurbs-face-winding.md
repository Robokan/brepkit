## Summary

`uv_winding` reads which way a face's boundary runs about its surface's normal, so that `normalize_face_normals` can turn a face whose wire runs backwards. For a B-spline face it returned `None`, and the face fell back to the boundary integral about the samples' centroid.

That reading fails for a long curved band. One example is a round along a B-spline rim that turns three quarters of a turn:

- the band's centroid falls outside the band, in the part;
- read about that point, the boundary's winding comes out reversed;
- so the band was left facing into the part, and its mesh did not close.

A B-spline face's winding is now read in its own parameters, which do not bend with the band. The boundary samples are projected to `(u, v)` and unwrapped across a periodic direction. Their signed area there, times the sign of `∂u × ∂v` along the face's normal at the middle of the domain, gives the winding.

It returns `None`, and the fallback stays, where:

- a sample's projection fails;
- `∂u` or `∂v` vanishes at a sample (a patch collapsed to a pole, where any `u` will do);
- the loop winds round a periodic direction.

## Test

`crates/operations/tests/fillet_long_curved_band.rs` builds a prism on a 270 degree sector whose arc is a quadratic B-spline, and rounds the arc's top edge at r = 1 and 2.

Each result must:

- validate;
- have six faces;
- mesh watertight;
- take off about the corner's volume: (1 - π/4) r² along the edge, less (5/6 - π/4) r³ for each radian the edge turns. The check is within 5%, because the walked band is fitted through its sections and stands a little off them.

Without the change it fails at r = 1: the mesh is not watertight.

Topology, blend, operations, io and algo tests pass.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
