## What

Round a closed spine, the walking engine's first step now starts at an eighth of the longest step, and grows as steps are taken. It used to start at the longest step. An open walk starts as before.

## Why

The walker solves a section at each step and grows a step by half after each one it takes. A turning spine halves the step. The first step was the longest allowed, 0.05 of the spine.

On a plate whose outline bends just past its start, that first step was about 19 mm along the rim, and the steps after it, round the bend, about 1 mm. The band and its contacts are interpolated through the sections. Across a gap that much longer than its neighbours, the contact swung 0.19 off the wall it should lie on.

The part was a plate 12 thick, its wall split at half height into two faces, both rims rounded at r = 6. That is a full round: each round's contact should land on the wall's middle rim and leave each half of the wall a sliver, which goes. With the contact 0.19 off the rim, the slivers stayed and the result was open.

## How

`Walker::walk` starts a closed spine's walk with a step of `0.125 * max_step_fraction * span`. The growth by half after each step taken is unchanged, so the walk reaches the longest step within about six steps wherever the spine allows it. An open walk keeps its long first step: its end sections are where a round's run-ons and cuts to its end faces start, and a short first step there changed those (a round swallowing a narrow face between tilted end faces then crossed its own wire).

## Tests

- `crates/io/tests/fillet_full_round_split_wall.rs` reads the plate from STEP (`tests/data/split_wall_spline_plate.step`) and rounds both rims at r = 6. It checks validity, a watertight mesh, 4 faces (the two caps and the two rounds), and the volume removed. That volume is checked within 1e-3 against Pappus: each rim's section, r² (1 − π/4), swept along the path of its centroid, L − 2πc round the closed outline, with L the wall's area over its height. The test fails without the change: 6 faces.

Blend, operations and io tests pass; clippy and fmt are clean.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
