## Problem

`merge_duplicate_edges` took two edges for one whenever they joined the same two points. A hole's arc and a box's straight edge across the hole join the same two points when the hole's seam lies below the box's top face. Merged into one edge, the strip of the box's top inside the hole and the hole's wall above it shared one edge set and read as a doubled face. On `main` today the result is then refused and the fuse falls back to the mesh boolean; with other result checks it has come out about 7% too large, with no error.

## Change

`builder/builder_solid.rs`: lines, circles and ellipses now also have to share their middle point, within a quarter of their size, before they merge. Each edge joins the first edge before it that it runs alongside; otherwise it is an edge of its own. The allowance lets a faceted ball's chords still join the arcs they stand for, and the arc a ball's equator chords stand for still goes first, so it stays the canonical edge. Closed and NURBS edges still match by their ends, as before.

A shallow arc (under about 100 degrees) still passes for the straight edge across it. A tighter allowance keeps it apart, but breaks existing cases where straight edges stand for arcs and have to join them (the keyhole knuckle, the interior fillet fuses, an elliptical boss). Those shallow cases fall back to the mesh boolean, as on `main`, rather than come out wrong: the merged edge has four faces and the result is refused.

## Tests

- `fuse_box_top_crossing_plate_hole_keeps_the_open_part`: a box fused into a holed plate with its top face crossing the hole, the hole's seam below the box's top. With the top 1 below the hole's axis the fuse is exact (on `main` it falls back to the mesh boolean), matches its closed-form volume to 1e-6, and classifies points in the open part of the hole as outside. With the top 1.5 above the axis, where the arc is shallow, the fuse still falls back; the test checks that any exact result there holds its volume.
- `cargo test -p brepkit-algo -p brepkit-operations -p brepkit-io -p brepkit-heal` passes; clippy is clean. The pose sweep and truth audit outputs are identical to `main`'s.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
