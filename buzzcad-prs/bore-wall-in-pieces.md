## Summary

`fillet_over_bores` rounds a rim that bores open on: it fills the bores, rounds the rim, then cuts the bores back through the round. `bores_opening_on` took a bore to be a single cylinder face from mouth to mouth. A bore drilled from both sides, or split by an earlier boolean, has its wall in several coaxial pieces of one radius, joined along circles. Such a bore was not found, so the round was refused.

A bore is now the chain of coaxial cylinder pieces of one radius, walked from a mouth across the circles they share until the other mouth. All of its pieces are filled and cut back.

## Tests

- `a_bore_whose_wall_is_in_two_pieces_cuts_back_through_it` in `crates/operations/tests/fillet_over_a_bore.rs`: a plate drilled from both sides (same-domain faces left unmerged), its rim rounded. The test asserts two wall pieces, a valid and watertight result, and the removed volume. It fails on main.
- The math, topology, algo, blend, operations and io tests pass on this branch.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
