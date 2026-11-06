## What

A fillet of a straight edge whose end face is tilted to the edge now runs the round on to that face and notches it, as it already does for an end face square to the edge.

## Why

A round of a straight edge between two planes is a cylinder, and its sections stand square to the edge. Where the edge ends on a single planar end face square to it, the end section lies in that face. The contacts then end on the face's two corner edges, and the face takes the notch (`terminal_cap_is_notchable`, `notch_face_corner_with_arc`).

Where the end face is tilted, the end section stands off it, and the contacts end short of the corner edges. The end could not be notched, so it was closed by a runout patch in the section plane:

- With a one-edge round of a prism whose ends lean, the assembly's incidence audit refused the result: "result edge has 1 uses".
- With more edges, the patch left a crack in the mesh (the support face ran out along the patch's edge and back, which its mesh skips), or a step face where the round should meet the end face.

## How

`run_stripes_to_tilted_caps` runs after the trihedral setback. It looks for a terminal junction that meets all of these conditions:
- the stripe is a cylinder band;
- the end has a single planar cap with two straight corner edges;
- the cap is neither square to the band's axis nor nearly parallel to it.

At such an end:
- Each contact, a straight line on its plane, is run on (or back) to where it meets the cap's plane. That point lies on the support face's corner edge with the cap. The stripe is left alone unless both contacts reach the corner edges.
- That end's cross edge is the cylinder's section by the cap's plane, an ellipse, from the new `builder_utils::cylinder_plane_arc`.
- The cap then passes the notch test and takes the ellipse as its notch.

The notch test also changes. It now takes each contact's end at a spine end from the end section, not as the end nearer the corner vertex. Those differ where the round is wider than its edge is long: a 225 radius on the 55 long edges of a plate.

## Tests

- `crates/operations/tests/fillet_tilted_end_caps.rs` builds prisms whose ends lean, both across the round and along it, inward and outward, at r = 1 and 2.5. Each result must:
  - validate and be watertight;
  - gain one face;
  - have two ellipse edges;
  - lose the corner strip's area r²(1 − π/4) times the distance between the end planes at the strip's centroid, r(10 − 3π)/(12 − 3π) from the corner, within 1e-6 of the volume.

  Without this change both tests fail at the incidence audit.
- In `regress_fillet_variable_retry_seam_stub.rs`, the pinned runout-patch gaps shrink: 10 to 4 and 6 to 3. One end of each fixture meets a tilted end face (P4 sits at a different y from P5) and is now notched rather than patched.
- `cargo test -p brepkit-blend -p brepkit-operations` passes. The exception is `compound_cut_edge_tangent_tools_stays_analytic`, which fails only in a parallel run, with or without this change, and passes alone.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
