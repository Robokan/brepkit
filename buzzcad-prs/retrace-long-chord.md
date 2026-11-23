## What

A surface-surface section traced twice is now dropped whole, even where the
first trace takes a long chord between two short ones.

## Why

The marcher can trace one section from several seeds. `chain_traced_segments`
drops the points of a later trace that lie on an earlier one, allowing for the
earlier chord's sag (`chord_bulge`). The sag came from the chord's turn against
its neighbour, read as the arc the chord spans. That holds only when the two
chords are the same length: the turn is the mean of the two arcs, so a chord
twice as long as its neighbours spans twice their arc but turns by only 1.5
times it. Its sag then reads as three quarters of the real sag.

A cylinder crossing a fillet's round about a millimetre past its contact
line shows this. The cylinder's section of the round was traced three times.
Two points of the third trace lay beside a long chord of the first, so they
were kept as a run of their own. That run was within one step of the chain's
end, so it was joined on there, running back along the arc. The section then
ended short of the round's contact edge. The round's face could not be split
along it, and the boolean failed ("face is cut by sections but split into
nothing").

## How

On an arc of one curvature, each chord spans an arc in proportion to its
length. So the arc a chord spans is its turn times `2 L / (L + L_neighbour)`.
`chord_bulge` now reads it that way, at each end, still capped at
`MAX_SAG_TURN`.

## Tests

- `a_retrace_beside_a_long_chord_is_dropped`: an arc traced with a 12-degree
  chord between 6-degree ones, then traced again with two points beside the
  long chord. Before the fix, the chain came out with 7 points, folded back.
  Now the re-trace is dropped and the chain keeps its 5.
- Workspace tests, clippy and fmt pass.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
