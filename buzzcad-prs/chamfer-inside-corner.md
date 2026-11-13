## What

A straight edge chamfered by the blend engine where the edge ends at an
inside corner of one of its faces failed with `TrimmingFailure`. Take an
L-shaped floor, with the edge running along the L's arm and ending where
the arm meets the wider leg. The chamfer's contact on the floor then ends
inside the floor, over the wider leg's side.

The trimmer ran that contact line on to the floor's boundary, which cut the
wider leg off as well. The end-closing step then found no run in an end
face from one contact point through the corner to the other, so the chamfer
was refused.

Two changes:

- `trimmer::trim_face_to_corners` trims a planar face as `trim_face` does.
  The difference is at an inside (reflex) corner of the face, where a blended
  edge's end vertex sits and its contact end lies off the boundary. There the
  face is trimmed back to the corner: its outline runs from the corner to the
  contact's end, then along the contact. The chamfer builder passes the
  edge's two vertices. A corner that is not an inside corner, or whose
  contact end lies on the boundary, is trimmed as before.
- In `close_chamfer_ends`, where no run passes the corner, the wedge the
  chamfer takes off leaves a triangle of the end face bare: the corner and
  the two contact points. The end face's edge from the corner to its
  contact point gives way to the floor's new edge from the corner and the
  chamfer's cross edge. This applies only when both edges are used once and
  the end face is a plane that holds the cross edge.

## Test

`crates/operations/tests/chamfer_into_an_inside_corner.rs` builds a bar on
an L-shaped profile and chamfers the arm's edge with two distances: 2.5 and
12.86, 1 and 1, and 2 and 30. It also checks a turned and moved copy. Each
result must be valid and watertight, have one face more than the bar, and
take off d1 d2 / 2 per unit length to 1e-6. Without the change, every case
fails with `TrimmingFailure`.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
