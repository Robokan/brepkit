## Summary

A face read from a file can have its edges stand off its surface: some STEP writers leave a B-spline skin's boundary edges up to 3e-3 off the skin. A round's contact on such a face ends on that boundary, so the contact's ends stand off the surface just as far.

- The trimmer mapped contact points onto a curved face only within 1e-4, so a larger gap refused the round ("trimming failure").
- The end-face notch read contact ends on their edges within 1e-5, and the trim's split read them within 1e-4. A gap of 1e-5 left the end face whole, closed by runout patches. The result was valid, but its mesh was open.

Each of these now allows as far as the face's own boundary stands off its surface, measured on the boundary edges (`mapped_uv_allowance` in the trimmer, `edge_off_surface` in the notch check). Planes keep their tolerances.

## Test

`crates/operations/tests/fillet_skin_edges_off_surface.rs`: a box's top is replaced by a flat B-spline standing 0, 1e-5, 3e-4 or 2e-3 above its edges, and one top edge is rounded at r 1 and 2.5, upright and in a turned pose. The test checks that the result is valid and watertight, that it has one face more than the input, and that the removed volume matches (1 - pi/4) r^2 L up to the offset's share. On `main` it fails: at 1e-5 the mesh is open, and the turned pose at 3e-4 is a trimming failure.

blend and operations tests pass (2308); clippy is clean.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
