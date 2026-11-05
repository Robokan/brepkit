## Problem

Two solids that only touch, along an edge or at a corner, fused into one shell whose contact edge carries four faces (or whose contact vertex joins two cones of faces). The result gate rightly refuses that non-manifold union, so the fuse went to the mesh fallback and every surface type was lost: two unit boxes offset by `(1, 1, 0)` came back as a faceted mesh.

## Change

- `boolean/assembly.rs`: `separate_touching_pieces` groups the union's faces through edges with exactly two uses. Every piece after the first takes its own copies of the vertices and edges it shares with another piece (pcurves copied with them), so each piece is a closed manifold shell on its own.
- `boolean/mod.rs`: before falling back, a fuse or cut whose union separates into two or more pieces this way is kept when the pieces only touch, the result is closed and manifold, the pieces' Euler characteristics balance, and it validates. "Only touch": a point inside each piece, and a point just inside each of its faces, lies outside every other piece. The builder splits faces along every section, so a face of a piece that overlapped another would lie wholly inside it.
- `heal.rs`: `unify_faces` no longer merges faces across an edge with more than two uses, straight or curved. Merging them pinched the pieces back together through the contact edge.
- `boolean/mod.rs`, containment shortcut: separate pieces exposed a gap. A solid in several pieces that fill recesses of the other has every vertex and edge on the other's boundary and its centre between the pieces, so every witness read it as inside, and the fuse returned the outer solid alone. A point inside each piece (pieces read through edges with exactly two uses) is now classified against the other solid too.

## Tests

- `touching_blocks_fuse_exactly_into_separate_pieces`: unit boxes touching along an edge and at a corner fuse into two valid pieces of volume 2; coincident and overlapping boxes still fuse into one.
- `pieces_filling_pockets_fuse_into_the_whole_block`: a 10 x 10 x 10 block with two 2 x 2 x 2 pockets in its top, fused with a two-piece solid filling them, gives the whole block (1000) as one valid piece. Without the piece witness it returns the holed block (984).
- `mesh_fallback_counter_records_fallbacks` used the edge-touching fuse as its fallback case; it now cuts a rod through a torus's wall (the case `compound_cut_cuts_the_exact_piece_and_defers_the_other` relies on), which falls back when run alone.
- `pinched_and_nested_pieces_are_invalid` builds its pinched union with the GFA builder directly, as the boolean now separates it.
- `cargo test -p brepkit-operations -p brepkit-algo -p brepkit-heal -p brepkit-io` passes; clippy is clean. The pose sweep and truth audit outputs are identical to `main`'s.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
