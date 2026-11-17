## Summary

Two changes to how B-spline surfaces with many knot spans are searched. Every result is unchanged: 507 slow booleans on parts from real designs write the same STEP byte for byte before and after.

- **A B-spline surface keeps its knot spans in an index** (`nurbs/span_index.rs`, new; `nurbs/projection.rs`, `nurbs/surface.rs`). `span_patches` read every knot span's control box for each point it searched near, then sorted them all. On a fitted surface with thousands of spans that is most of a projection, and a boolean projects most of its points off the surface. The spans and their control boxes are now kept in a `SpanIndex`, made once per surface in its caches, whose BVH gives only the spans near the point. Their distances are read and sorted as before, nearest first and in span order among equals, so the patches searched, and the answer, are the same.

  The index also keeps each span's sub-patch boxes, made the first time they are read: the span's Bezier net, read off its control points by blossoming, then split twice each way by de Casteljau. Each piece lies in the hull of its own net. Over a span that turns through a wide angle (a wing skin round its nose), the span's control box holds points of the surface far from the span, while the sub-patch boxes hug it closely. `SpanIndex::box_clears` reads them to tell a box that lies clear of the surface.

- **An edge clear of a B-spline surface skips its crossing scan** (`pave_filler/phase_ef.rs`). The edge-face pass scans each edge against each B-spline face whose box it meets, projecting the edge's samples onto the surface. Where every point of the edge lies farther from the surface than twice the scan's near limit, the scan can find no crossing: its distances are those of points of the surface, or bounds below them, and it keeps only crossings within the tolerance of the surface. Each edge is now held in piece boxes (a line's eight pieces, a conic's sixteen arcs grown by their sag, a B-spline's Bezier nets). A pair whose pieces all clear the surface's sub-patch boxes by that margin returns no crossings at once. On one part's fuse, 3,678 of 3,873 edge and B-spline face pairs are cleared this way.

## Timing

Slow booleans from real designs, their inputs read from STEP first (several have bodies of more than one solid, run solid by solid). The time is the booleans alone, once each, one case at a time:

| | `main` | this branch |
|---|---|---|
| 297 slow booleans | 399.4 s | 368.4 s (1.08x) |
| 210 other booleans | 78.8 s | 66.7 s (1.18x) |
| case 1 | 8.01 s | 2.54 s (3.16x) |
| case 2 | 8.30 s | 2.85 s (2.91x) |
| case 3 | 8.21 s | 2.83 s (2.90x) |
| case 4 | 2.24 s | 1.29 s (1.74x) |
| case 5 | 2.40 s | 1.43 s (1.68x) |

No case is slower (one that read 0.68 s -> 0.85 s once reads 0.68 s both ways over five runs).

## Tests

New: `span_index::tests` (the index's spans within a distance match reading every span and sorting; sub-patch boxes hold their span, and part a span from a point its control box holds; a box within reach of the surface is never clear) and `phase_ef::tests::curve_piece_boxes_hold_the_curve` (a line, a circle's arc, an ellipse's arc past a half turn and a rational B-spline's sub-span, each sampled densely, lie in their piece boxes).

algo, operations, blend, io, topology, check and math tests pass (4,258); clippy, fmt, `check-boundaries.sh` and `check-mul-add.sh` are clean; the pose sweep and truth audit match `main` line for line.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
