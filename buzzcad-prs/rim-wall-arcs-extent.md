## Summary

`kept_wall_boundary_height` finds how low a closed rim's wall reaches below the rim, so that a round of the rim is refused when it would run past the wall. It read every circle or ellipse in the wall's boundary as the whole conic, at its lowest point all round. A wall notched by a slab leaning across it has elliptic arcs in its boundary. Read whole, the ellipse dipped far below the arc's own ends, so the wall read as too short and the round of the rod's top rim was refused.

Each arc now reads its own extent (`domain_with_endpoints`): its lowest point is the lower of its two ends, or the conic's lowest point where that lies within the arc.

## Tests

- `crates/operations/tests/fillet_rim_above_a_wall_notch.rs`: a rod (R 10, H 30) notched by a slab leaning 0.15 or 0.3 rad at depth 18, its top rim rounded at r 1 and 2.5. The removed volume must equal 2π(1 − π/4)r²(R − inset·r). It is refused on main.
- The math, topology, algo, blend, operations and io tests pass on this branch.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
