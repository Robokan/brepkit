## What

A plane cut through rounds that meet in mitres is now exact. It used to fall back to a mesh.

## Why

Take a disc flattened on two sides and round its top rim. The rounds of the arcs are pieces of a torus, the rounds of the flats are cylinders, and where they meet the fillet leaves a mitre: a crease, a B-spline edge between the torus piece and the cylinder. Now split the part with a plane a little below the top, through the rounds. On each torus piece the plane's section is a circle, and the circle leaves the piece where it crosses the mitres.

Three things went wrong there:

1. `circle_face_hits` found where the circle crosses a face's edges only for edges lying in the circle's plane. A mitre passes through the plane at one point, so the circle was never split there. It ran on round the whole torus, past the piece's ends.
2. `emit_split_circle_arcs` keeps the arcs that lie on both faces. A torus face that `TorusRegion` cannot read (a piece ending on mitres, not on meridians) was checked against its box alone. That box holds the arc running on along the next pieces of the same torus, so the arc was kept twice, once on each piece.
3. `boundary_edges_to_pcurve_with_images` splits a face's B-spline boundary edges at the points where sections end, on cylinders and B-spline faces. A torus's mitre was left whole, so the section's ends met no vertex of the face's boundary.

Every round face then came out unsplit or doubled, and the boolean fell back to the mesh (over a thousand faces).

## How

- `circle_face_hits`: for an edge not in the circle's plane, the signed distance to the plane is sampled along the edge. Each sign change is bisected. A crossing within 100 times the linear tolerance of the circle is snapped onto it and taken as a hit. Crossings at the edge's ends are left to the vertex checks.
- `emit_split_circle_arcs`: a torus face with no `TorusRegion` gets a `FaceLoops2d` of its wires. An arc's point must then lie inside the face's loops or on their boundary, as well as in the box.
- `boundary_edges_to_pcurve_with_images`: torus faces join cylinders and B-spline faces in splitting their open B-spline boundary edges where sections end.

## Tests

`split_through_mitred_rounds.rs` builds a disc of radius 60 and height 40. It flattens the disc on two sides with box cuts, rounds the top rim at r = 10 with `fillet_v2`, then splits it with a plane 4 below the top. There are three variants: opposite flats 58 from the axis, opposite flats 50 from it, and two adjacent flats. Each split is checked for:
- both halves valid, with a watertight mesh;
- at most 12 faces in each half;
- the same number of torus faces in each half, and at least two cylinders;
- the halves' volumes adding up to the whole within 1e-6.

The test fails without the change: the split falls back to the mesh. Taking out any one of the three changes alone makes it fail too. Algo, operations, blend, io and topology tests pass; clippy and fmt are clean.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
