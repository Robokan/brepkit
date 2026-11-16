## Summary

Seven changes to where the slowest booleans on parts from real designs spent their time. Every result is unchanged: the 30 booleans timed below, and 210 others, write the same STEP byte for byte before and after.

- **A ray passes over an extrusion face whose profile it cannot meet** (`classifier/ray_cast.rs`). Extrusion faces have no box in the ray caster's face index, since their crossing test also reads grazes off the patch, along the surface's run past its ends. So each one sat in the list every ray reads. On a part with hundreds of extruded spline sides, one boolean made 4.4 million extrusion tests, each walking the profile's 65 or more sample intervals. A profile now keeps the box of its control points in the plane square to the extrusion, which holds the profile while its weights are positive. The test counts a hit, or reads a graze, only where the ray's line, seen along the extrusion, comes within the tolerance of the profile. So a line passing that box by more than the tolerance and the rounding reads nothing, and the test returns at once. A ray along the extrusion is read against the box as a point. The profile's points at its 65 even steps, which such a ray is tested against, are now kept with its other samples instead of being evaluated for every ray.
- **A B-spline face's trim keeps the nearer foot of a boundary point** (`classifier/ray_cast.rs`). The trim projects each sample of a boundary edge by Newton from the sample before, and searches the whole surface when that Newton does not land on the surface. On a fitted surface with many spans, the search settled on a foot 0.55 off for a point lying on the surface. The next sample's Newton then started from that far foot and missed too. The edge's (u, v) ran off it, its samples were split to the cap of 4096, and the turn search ran 692 golden-section searches of 62 projections each. Of the two feet, the nearer is now kept.
- **The touching-pieces gate meshes each piece once** (`boolean/mod.rs`). `pieces_only_touch` meshed each piece for its witnesses, then again, at the same deflection of the same box, for its interior point. The interior point is now read on the first mesh.
- **A face's box candidates that the box already holds are not read** (`measure/bounding_box.rs`). A sphere or torus face's box takes the surface's farthest points along each axis that the face holds, each read against the face. Along a torus's axis those are two circles of 360 points. A candidate inside the box built so far cannot grow it, held or not, so only the others are read. On a filleted part, 86% were inside.
- **A plane face's hole polygons are sampled once per pass** (`builder/fill_images_faces.rs`). Clipping a section line to a holed plane face read the face's hole polygons for every line, sampling each curved hole edge 96 times, though the polygons are the face's own, in the frame of its outline: only the crossings are the line's. They are now kept with the face's loops for the pass. The arc crossing search also reads its edge's span once (`edge_point_at`), not at every evaluation.
- **A valley walk that comes back to a state it held gives up** (`nurbs/intersection/plane.rs`). `trace_valley` walks the floor of a valley of a plane's distance on a B-spline patch in up to 4096 steps each way, settling across it by Newton each step, and a walk that runs out of steps gives no curve. Every walk that ran out had fallen into a cycle two to four states long within its first 64 steps and went round it to the limit. The walk is a function of its state alone (where it is, its direction and step, whether it has left its start), so the state is kept at each power of two of its steps (Brent's cycle check), and a walk that meets it again stops there with no curve, the answer it would have reached.
- **The seed grid takes a pair's root only where it can count** (`nurbs/intersection/surface_seeding.rs`). `find_ssi_seeds_grid` took a root for every pair of the two patches' grid samples. A pair whose square passes both samples' nearest squares and the threshold's square (padded for its rounding) has a distance no nearer, since the root is monotone, and changes nothing, so no root is taken for it.

## Timing

30 slow booleans from real designs, their inputs read from STEP first (several have bodies of more than one solid, run solid by solid). The time is the booleans alone, the median of 3 runs, one case at a time:

| | `main` | this branch |
|---|---|---|
| all 30 | 98.5 s | 89.1 s (1.11x) |
| case 1 | 9.53 s | 4.74 s (2.01x) |
| case 2 | 2.29 s | 1.10 s (2.08x) |
| case 3 | 1.59 s | 0.87 s (1.84x) |
| case 4 | 1.44 s | 0.93 s (1.55x) |
| case 5 | 1.02 s | 0.64 s (1.61x) |

The fifth change, timed apart on the 60 slowest booleans (case 1 is the same part as above; the rest move within run-to-run noise, all 60 together 134.6 s before and 134.0 s after; their STEP the same byte for byte):

| | before | after |
|---|---|---|
| case 1 | 4.76 s | 3.63 s (1.31x) |

The sixth and seventh, timed apart on 297 slow booleans, once each (their STEP the same byte for byte): all 297 382.0 s before and 372.1 s after; a part whose valley walks ran to the limit 0.298 s -> 0.086 s (3.45x), others 2.33 s -> 1.96 s and 1.15 s -> 0.95 s.

## Tests

algo, operations, blend, io, topology, check and math tests pass (4,192); clippy and fmt are clean; the pose sweep and truth audit match `main` line for line.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
