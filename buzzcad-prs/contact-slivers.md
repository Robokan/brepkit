## Summary

Round the top outline of a boss that stands exactly one radius high. Each round's contact on the boss's wall lands on the wall's bottom edge, so the wall is left as a strip of no area between the contact and that edge.

The trim kept that strip as a face of two edges: the round's contact and the wall's bottom edge, both joining the same two vertices. The result was closed by edge count, but:

- it had one face too many per wall;
- the round met the face below across the strip, not along one shared edge, so the mesh was open there.

After the post-assembly audit, such faces are now dropped. A face qualifies when its wire is exactly two edges joining the same two vertices, one of them the input's own edge and the other an edge the fillet made, lying on it. The round then takes the input's edge in place of its contact, run the same way, so it meets the face below along that edge. Each edge keeps two uses.

"Lying on it" allows 1e-4 of the edge's span. A walked contact is fitted through its sections: a round of 3 along a quarter arc of 4.5 stands 3.2e-4 off the arc.

`regress_two_edge_exact_limit.rs` pinned the old topology at the exact limit r = S. There, each stripe's side contact lands on the cube's bottom edge, the same zero-area strip. The stripe now runs along the bottom edge rather than its fitted contact. The test checks for that; its volume, area and crease checks are unchanged.

## Test

`crates/operations/tests/fillet_boss_one_radius_high.rs` builds a 20 x 14 boss, its vertical edges rounded at 4.5, fused 3 high onto a plate. All eight top edges are then rounded at r = 3. The result must:

- validate;
- have 15 faces (no walls);
- mesh watertight at 0.5 and 0.05;
- match the closed-form volume to 3e-5. The corner rounds are walked bands measured on their mesh, about 1e-5 light here and closing on the closed form as the deflection shrinks.

Fails without the change: 23 faces, the 8 walls kept as strips.

Blend, operations, io and algo tests pass.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
