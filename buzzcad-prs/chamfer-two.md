Adds `chamfer::chamfer_two_on`: a two-distance chamfer where each edge names the face its first distance is measured on (a distance-and-angle chamfer is `d2 = d1 * tan(angle)`). Closed circular rims between a cap and a coaxial wall are cut by the rim chamfer, which now takes a cap and a wall distance; other edges go to the blend engine's chamfer, which gains `ChamferBuilder::add_edges_asymmetric_on` and `blend_ops::chamfer_v2_on`.

Two fixes it needed:

- The blend trimmer dropped a trimmed planar face's holes, leaving a drilled face's hole wall open after a chamfer of its outer edge. Holes on the kept side of the contact line now stay with the face; a hole across the line refuses the trim.
- The original engine's asymmetric chamfer set both corner offsets on the chamfered edge's end faces to the larger distance, leaving a wedge at each end; its volume test had locked in the wrong value (0.965 for a unit cube's edge at 0.2 x 0.3, which removes exactly 0.03). Each side now sets back by its own face's distance.

## Tests

- Added `crates/operations/tests/two_distance_chamfers.rs`: a drilled plate's edge chamfered from either face (the hole kept, the reference face's setback checked) and a countersink at two distances, both at closed-form volumes.
- The asymmetric single-edge volume test now expects 0.97.
- `cargo test -p brepkit-blend -p brepkit-operations` and `cargo clippy -p brepkit-blend -p brepkit-operations --all-targets -- -D warnings` pass.
- `compound_cut_edge_tangent_tools_stays_analytic` fails now and then in a full parallel `--lib` run, on unmodified `main` too; it passes alone (it reads a process-wide fallback counter that other tests' fallbacks can bump).

🤖 Generated with [Claude Code](https://claude.com/claude-code)
