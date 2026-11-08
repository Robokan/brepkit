## What

A concave fillet ending where its cap cannot be notched (an arm leaving a plate's side, the round's ends meeting four faces each) now gives a watertight result. Two rounds along both edges of a strip narrower than their setbacks are now refused, where before they built a solid whose face crossed itself.

## Why

A terminal whose cap cannot be notched keeps the edge leaving the spine's end (the spoke) whole, and the trim bridges the contact's end to that vertex with a straight runout edge. Where the contact ends on the spoke itself, the runout edge lies along the spoke. The support face's wire then runs out along the runout edge to the spine's end and back along the spoke. Every edge still has two uses, so the shell reads closed, but the face's mesh skips the doubled-back stretch while the spoke's other face meshes the spoke whole: a crack along the spoke.

`fold_spoke_spurs` now splits the spoke where the runout edge ends. The spur's face keeps only the far piece, and each other face along the spoke takes the runout edge and the far piece. It folds only where the patch beyond the short edge carries on the face beyond the long one, in its plane and facing its way. A patch standing in its own plane, or facing the other way, covers material the fillet removed, and folding it in would only close a wrong shell. A one-edge fillet with such an end takes the selective split policy, so its unsplit terminal keeps its spoke.

Folding exposed a second fault. With both long edges of a box's top rounded and the top narrower than `2r`, the two contacts on the top pass each other: each lies nearer the other round's edge than its own. The top was trimmed between them to a loop that crossed itself, and the result validated with too much area and too little volume. `check_contacts_keep_their_edges` refuses that case. It applies only where both contacts run alongside both edges' middles and each lies nearer the other's edge than its own, so contacts that only come close near a corner still build.

## Tests

- New `crates/operations/tests/fillet_concave_corner_ends.rs`: a 3-thick plate with an arm leaving its side, the arm flat or with its top and bottom rising away; the concave vertical edge between them rounded at r = 1 and 2. Each result validates and is watertight, and adds the corner's strip `T r^2 (1 - pi/4)` (within the caps' tilt against a rising arm's faces).
- New `crates/operations/tests/fillet_narrow_ridge.rs`: a box whose top is 2 wide, both long top edges rounded. At r = 0.9 the result keeps a strip of the top, validates, is watertight and removes the two strips' closed-form volume; at r = 1.5, where the contacts pass each other, the fillet is refused. This one passes on `main` too; it guards the refusal, since the fold alone builds the self-crossing top. `fillet_concave_corner_ends.rs` fails before this change.
- `cargo test -p brepkit-blend -p brepkit-operations -p brepkit-io` passes.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
