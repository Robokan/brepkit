## Summary

A round's contact that ends on a face's boundary edge splits that edge where it ends. The mapped trim (`rebuild_mapped_parametric_face`) finds the split point in two steps:

1. a coarse scan of 64 samples along the edge;
2. a ternary search over the bracket around the best sample, run a fixed forty times.

Forty thirds leave the bracket at about 1e-7 of the scan's step. A line's domain is its length, so on a long edge that is not small. On a 4000 mm edge the search stopped up to 3e-6 off the contact's end, past the 1e-6 the end is held to, and the split was skipped.

The face then kept its whole long edge beside a connector from the contact's end to the corner. The faces at the round's ends could not be notched, and the incidence audit refused the fillet. Whether it did turned on where the search happened to stop, so a 4000 mm bar failed and an 8000 mm one passed.

The search now runs until the bracket stops shrinking: about 80 steps on a line, at most 200. The bracket is clamped to the edge's domain whichever way the domain runs.

## Test

`crates/operations/tests/fillet_long_bar_ends.rs` rounds both edges of one end of a 64.5 x 28 bar at r = 13. It runs lengths 200, 4000, 8000, 11260 and 30000, each also turned about the bar's width.

Each result must:

- validate;
- mesh watertight;
- have 8 faces;
- match the closed-form volume to 1e-9.

Fails on `main` at length 4000.

Blend, operations, io and algo tests pass.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
