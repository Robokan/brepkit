## What

A blend-engine chamfer whose distance reaches exactly across one of its
faces failed brepkit's own validity check. Take a plate's end edge
chamfered by the plate's thickness: the trim left the end face as its far
edge plus the contact along it, a face of two vertices and no area.

The face now goes. When a trim leaves a face as just two straight edges with
the same ends, the chamfer adopts the face's far edge as its contact, so it
meets the neighbour across that edge, and the face is left out of the
result. The ends close as before: the side faces lose their triangles, and
the end face's vertical edges drop out with it.

## Test

`crates/operations/tests/chamfer_consumes_a_side.rs` chamfers both bottom
end edges of a drilled 200 x 69 x 10 plate by 10, and the same plate turned
and moved. The hole sends the chamfer to the blend engine. Each result must
be valid and watertight, keep its face count (two end faces go, two chamfer
faces come), and match the closed-form volume to 1e-6. Without the change,
validation reports both end faces with only 2 vertices.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
