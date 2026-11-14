## Summary

The edge-edge phase samples two edges into chords and finds each pair's closest approach. That divides by `a c - b^2`. If two edges lie on one curve and run opposite ways, their chords lie on each other, and that divisor is exactly zero or rounding noise.

- When it is exactly zero, the parallel test (an absolute 1e-20) caught it and took the chords' middles. That reported a crossing inside a shared edge.
- When it is noise, the crossing could land anywhere along the chords.

Which of the two happened depended on how the products rounded. Booleans whose edges lie on each other moved between an exact result and the mesh fallback whenever a multiply-add's rounding changed. Moving from a fused multiply-add to plain multiply-then-add moved several such cases. One was a fuse whose shared edge picked up a phantom split.

Now, when two chords are all but parallel (`a c - b^2` under 1e-12 of `a c`), they meet at an end of one chord and that end's foot on the other. Of the four end-and-foot pairs, the closest is taken.

## Test

`phase_ee::tests::chords_lying_on_each_other_meet_only_at_their_ends` builds 20,000 pairs of antiparallel chords lying on each other, in many sizes and directions. One chord's ends are a rounding off the other's. The test requires each pair to meet at their ends only. Without the change it fails: a pair meets at 0.667 along a chord.

algo tests pass; clippy is clean.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
