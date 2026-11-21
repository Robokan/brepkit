Stacked on #2644 (and through it on #2643, #2642, #2641 and #2639); the top commit is this PR. It is the last of the backlog: two chamfer and query changes, and the fillet tests that waited for the measure, boolean or meshing fixes below them in the stack.

## Code

- **`chamfer::chamfer_two_on`** joins a straight edge's pieces first, when two picked edges are collinear pieces sharing a vertex and the same two faces. A pieced edge then takes one chamfer along its whole length, not one per piece meeting end to end. Test: `two_distance_chamfers.rs::a_straight_edge_picked_in_pieces_takes_one_chamfer`.
- **`query::tangent_chain`** gives the edges running on tangent from picked ones: each step takes the one edge at a vertex that continues the curve within the angle and shares a face, and isn't tangent across its own faces. It also runs on over faces split at a vertex. A round of one piece of a closed rim can then take the whole rim, as other kernels run on along the tangent chain. Unit tests in `query`.

## Tests that waited for the layers below

| test | needs |
|---|---|
| `fillet_spline_rims.rs` (volume checks no longer ignored) | the exact B-spline band measure (#2644) |
| `fillet_round_off_a_ledge.rs`, `fillet_walked_ends_on_a_skin.rs` (volume to 1e-5 again) | the same |
| `fillet_ball_wedged_on_drafted_wall.rs`, `fillet_contact_across_wall_seam.rs` | the STEP reader (#2642) and the measure (#2644) |
| `fillet_ball_pivot.rs`, `fillet_open_contact_over_hole.rs`, `fillet_ring_rims_meeting.rs`, `fillet_round_over_a_thin_rim.rs` | booleans or meshes from #2643 and #2644 |
| `rounded_box_corners.rs` | the measure: the corners are balls, the volume closed-form |

One more test waits: a plate rounded round both its outlines, where every face is rebuilt, needs #2640 (face normals with no seed) as well as this stack. I'll add it once both have landed.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
