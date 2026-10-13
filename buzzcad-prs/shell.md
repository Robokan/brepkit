The boolean assembler judged a correct, holed shell to be inward and failed with "no outer shell found", sending the boolean to the mesh fallback.

`signed_volume_of_shell` and `shell_is_outward_oriented` integrate each planar face over its outer loop alone, ignoring its holes. On a part far from the origin with large holes in its walls (a housing at z ≈ 700 to 1150 with drilled and pocketed walls), the uncounted hole area outweighed whole walls and turned the readings' sign. Each planar face's reading is now scaled by the share of its outer loop that is face rather than hole. Hole loops are sampled along their curves, so a round hole (one closed circle edge, one vertex) counts.

Found replaying a downstream CAD app's recorded booleans against a reference kernel: three cuts and fuses of such housings failed with "no outer shell found", and with this change and the STEP plane-orientation fix (separate PR) they match the reference's volume and face mix exactly.

## Tests

- Added `planar_net_share_counts_square_and_round_holes`: a face with a square hole and one with a round hole report their exact net share.
- `cargo test -p brepkit-algo -p brepkit-operations --lib` passes on this branch; the full io, algo and operations suites passed with all the related fixes together.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
