## Problem

A fillet along a closed rim trims the flat face on the rim's other side along the round's closed contact. That trim kept every hole of the face whole and unchanged. A hole near the rim (a plate drilled close to its edge, rounded by more than the hole's clearance) then goes wrong in one of two ways:

- the contact runs through the hole, so the trimmed outline and the hole cross each other;
- the hole lies wholly between the contact and the rim, outside the trimmed outline.

Either way, the hole's wall still stands at full height through the band.

The result passed `validate_solid`, and brepkit's own volume of it came out right, because the region concerned is small. But the face is invalid, and another reader, healing the crossing loops, read such a solid 6% light.

Building the case right means cutting the band with the hole's wall and opening the hole into the outline, which neither trim path does.

## Change

`trimmer.rs`: before either path of `trim_parametric_face_batch_in_place`, `check_holes_clear_of_closed_contacts` refuses (`TrimmingFailure`) a closed contact on a plane face unless each of the face's holes lies wholly on the side the contact keeps, away from the rim.
- The kept side is read from the contact's restriction: an `AwayFrom` point, or a `Side` (the contact's winding in the face's plane).
- Holes and contacts are sampled in the face's plane, in wire order, into closed polylines that carry their sag (the most a chord strays from its curve). A hole passes when a point of it lies on the kept side and the two polylines stay further apart than both sags together, so a crossing between samples is caught too.
- Closed contacts on one face are checked against each other the same way: two that meet are refused.
- A hole is exempt only from the contact whose own round runs on one of the hole's edges (the rim at a post's foot is a hole of its plate); every other contact on the face still checks it.
- Faces without holes, curved faces, and open contacts are unaffected.

## Tests

- New in `fillet_round_rims.rs`: a rod drilled through near its side, its top rim rounded at r = 2.
  - With the hole crossing the contact's circle, and with it between that circle and the rim, the fillet is refused. Without the change, the first is built.
  - With the hole wholly inside the circle, the round is built, valid, at the closed-form volume.
- Unit tests in `trimmer.rs` drive the guard directly: a hole on the kept side passes; one across or beyond the contact is refused, for both restriction kinds; a crossing that falls between samples is refused; a hole is exempt from its own round's contact and not from another's.
- `cargo test -p brepkit-blend -p brepkit-operations` passes, and clippy is clean.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
