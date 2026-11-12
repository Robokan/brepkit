## What

The blend engine's flat chamfer ends its contacts in the section square to
the edge at each end. That section is the end face's plane only when the
end face stands square to the edge.

Take a prism whose next side turns up at an angle. The contact on the
second face ended short of the slanted end face (or past it, for a face
leaning back over the edge). The trimmer ran it on to that face's boundary,
the chamfer face no longer matched its contacts, and the end could not be
closed: `TrimmingFailure`.

`run_to_end_planes` changes this case: one plane face closes the edge's end
at a slant, and the chamfer is a plane through two straight contacts. Each
contact line is now run on, or back, to that face's plane. The chamfer then
ends on its line in the end face, which takes it as it does at a square
end. Square ends are unchanged.

## Test

`crates/operations/tests/chamfer_slanted_end.rs` chamfers a prism's floor
edge where the end face is `x = A + k z`:

- k is 4.14 (a side turning up 13.6 degrees), 0.5 or -0.4 (leaning back).
- The distance pairs are (4, 1.865) and (2, 5).
- A turned and moved copy is checked too.

Each result must be valid and watertight, have 7 faces, and take off
`d1 d2 (A / 2 + k d2 / 6)` to 1e-9 of the prism's volume. That is the prism
to the end, plus or minus the tetrahedron the slant adds or removes. Without
the change, the slanted cases fail with `TrimmingFailure`.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
