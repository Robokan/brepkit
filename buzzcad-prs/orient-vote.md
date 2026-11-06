## Problem

`normalize_face_normals` catches result faces whose effective normal is backwards even though their edge senses agree with their neighbours. This is the state of a face built with its wire running the wrong way round, after `propagate_orientation` toggles its flag to match the faces next to it. The pass reads the convention (which way a face's boundary walks about its effective normal) from the seed faces, then triple-flips the result faces that disagree.

When no seed gives a reading, the convention stays 0 and nothing is flipped. That is the usual case for a fillet that rebuilds every face around it: a part whose edges are all rounded at once has no untouched input face left to seed from.

In the case that showed this, a part of planes and cylinders was rounded at r = 1 on 16 edges, among them both end faces' outlines, so every input face was trimmed. One torus corner and one small cylinder band came out facing into the solid:
- The result passed `validate_solid`.
- brepkit's own volume of it was 4% light.
- Another reader took the torus face as the whole torus less the patch: area 442.6 where the patch is 31.2.

## Change

`orientation.rs`: when no seed sets the convention, the faces being normalized vote. A closed shell walks every face's boundary the same way about its effective normal, so the few faces that disagree are the ones built backwards. They are triple-flipped as before (wire reversed, edge senses inverted, flag toggled), which changes their effective normal without disturbing shared-edge senses. A tied vote flips nothing. When seeds are present, they still decide.

The fillet builder's signed-volume check, which runs after this pass, still turns a whole shell that comes out inverted.

## Tests

- New unit tests in `orientation.rs`, on the manifold unit cube:
  - With no seeds, one face turned inside out (its wire reversed and its flag toggled) is turned back, and the other faces are left alone. Without the change, nothing is flipped.
  - With one seed and the other five faces turned, the seed still decides.
- `cargo test -p brepkit-topology --features test-utils`, `-p brepkit-blend` and `-p brepkit-operations` pass, and clippy is clean.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
