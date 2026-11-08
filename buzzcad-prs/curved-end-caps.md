## What

A round of a straight edge whose end meets a curved end face (a cylinder, or a cap of any surface) now runs on to that face and notches it, as #2309 does for a tilted plane. Stacked on #2335 (the spoke-spur fold), whose fold this extends.

## Why

The round ended in its section plane, closed by a runout patch. Against a curved cap that patch did not meet the cap along a shared edge, so the result failed the assembly's incidence audit, or its mesh was open.

Now each contact runs on (or back) along its line to where the line meets the cap, on the cap's corner edges. The band ends on its intersection with the cap, a cubic fitted through its rulings' hits on the cap, and the cap takes that curve as its notch (`notched_wire_edges` takes a fitted arc across any corner path).

Two more faults showed up on the way:

- The spoke-spur fold accepts a curved face beyond the spoke where it carries on within 0.05 rad of the patch's plane. A fitted surface rarely runs on exactly level.
- The trimmer's edge split builds both pieces in the edge's stored direction. A circle's arc built against it ran the long way round from the split, so a face walking its arc backwards (the D's bottom, below) read a whole disc too large, and the result came out inside out.

## Tests

- New `crates/operations/tests/fillet_curved_end_caps.rs`: a D prism, its straight edge along `x` at the top or the bottom rounded at r = 1 and 2, ending on the D's arc wall. Each result validates, is watertight, adds only the round face, and removes the corner strip out to the cylinder (integrated in closed form) within 1e-6 of the part. The test fails before this change.
- `cargo test -p brepkit-blend -p brepkit-operations -p brepkit-io` passes.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
