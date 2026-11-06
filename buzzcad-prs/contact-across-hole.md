## Problem

A fillet along a closed rim trims the flat face on the rim's other side along the round's closed contact. That trim kept every hole of the face whole and unchanged. A hole near the rim (a plate drilled close to its edge, rounded by more than the hole's clearance) then goes wrong in one of two ways:

- the contact runs through the hole, so the trimmed outline and the hole cross each other;
- the hole lies wholly between the contact and the rim, outside the trimmed outline.

Either way, the hole's wall still stands at full height through the band.

The result passed `validate_solid`, and brepkit's own volume of it came out right, because the region concerned is small. But the face is invalid, and another reader, healing the crossing loops, read such a solid 6% light.

Building the case right means cutting the band with the hole's wall and opening the hole into the outline, which neither trim path does.

## Change

`trimmer.rs`: before either path of `trim_parametric_face_batch_in_place`, `check_holes_clear_of_closed_contacts` refuses (`TrimmingFailure`) a closed contact on a plane face unless each of the face's holes lies wholly on the side the contact keeps, away from the rim.
- The test samples each hole's edges and the contact in the face's plane, with an even-odd point-in-polygon test.
- A hole holding the edge the contact rounds is exempt: the rim at a post's foot is a hole of its plate.
- Faces without holes, curved faces, and open contacts are unaffected.

## Tests

- New in `fillet_round_rims.rs`: a rod drilled through near its side, its top rim rounded at r = 2.
  - With the hole crossing the contact's circle, and with it between that circle and the rim, the fillet is refused. Without the change, the first is built.
  - With the hole wholly inside the circle, the round is built.
- `cargo test -p brepkit-blend -p brepkit-operations` passes, and clippy is clean.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
