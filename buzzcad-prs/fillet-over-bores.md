## Summary

When a round's band runs over the mouth of a through-bore, the round has to trim its face round the hole.

- A closed contact with a hole in its way is refused by the trimmer's hole guard.
- With the hole straddling the round's contact, the result was valid, but the face's outline crossed its hole and the mesh was open.

The round is now made around the bore, with the bore cut back through it afterwards (`blend_ops::fillet_over_bores`). This applies to each through-bore opening within four radii of a picked edge, on one of that edge's faces. A through-bore here is one cylinder wall between circle holes in two plane faces.

1. The bore is filled: its wall is left out, and its mouths are no longer holes.
2. The solid is rounded.
3. The bore is cut back through the round, a tenth of its radius past each mouth, with the exact boolean.

If the cut back is not exact, or is not a valid solid, it is dropped and the round is made as before.

The cut back needs a second fix, in the face splitter. A coaxial bore wider than a rounded rim's flat top cuts the round's torus band round its axis along one circle. The band split took only cylinder, cone and closed B-spline walls, so the torus band split into nothing and the cut fell back to a mesh. It now takes a torus band too:
- the band's seam is a meridian arc, each copy built the short way from its own start, so the two copies merge into one edge;
- its `v` is read within a half turn of the seam's, since the torus is periodic in `v` as well.

## Tests

- `crates/operations/tests/fillet_over_a_bore.rs`: a drilled box's top edge rounded over a bore lying wholly within the round's reach, and over one straddling the contact, upright and turned. Each is checked against the removed strip less its part in the bore, to 1e-4. Both fail on `main`.
- `crates/operations/tests/coaxial_bore_through_a_round.rs`: a rounded rod bored coaxially at r 1 and 2, upright and turned, checked against its solid of revolution to 1e-5. Both fail on `main` with the mesh fallback.
- `crates/operations/tests/fillet_round_rims.rs`: the rounds that pinned a refusal where a hole lay in the round's way now check the cut-back solid against its closed form. A hole across the round's contact on the rod's top, which notches the torus band from its edge, is still refused.

algo, operations, blend and io tests pass; clippy and fmt are clean; the pose sweep and truth audit are unchanged.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
