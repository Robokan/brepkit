## What

`chamfer` now chamfers a cylinder's rim that is in arcs, where a block stands on the cylinder's top. The block is narrower than the cylinder one way and overhangs it a little the other. Each convex arc is chamfered and cut off square at the block's walls. The concave arcs under the overhang are left as they are, and so is the cylinder's seam when it is picked too.

## Why

Here the rim is a chain of convex arcs, on the crescents of the top beside the block, and concave arcs, where the wall meets the block's overhanging underside. The chain turns from convex to concave at the block's walls. The blend engine's chamfer refuses each arc ("a curved chamfer ending off a plane square to its edge"), so the whole chamfer failed.

Another kernel's result for such a part is the crescents' bevel alone, cut off at the walls' planes. Its volume and area match that to 4 significant figures. The underside is narrower than the chamfer all along the concave arcs, so no chamfer of that distance fits there.

## How

A new fallback, `chamfer_arcs::chamfer_rim_arcs`, runs when the blend engine's chamfer fails.

- Every pick must be one of these:
  - a rim arc between a cylinder and a plane square to its axis;
  - the cylinder's seam, which is left.
- A convex arc must end on another arc, or on a line along a plane wall rising from its cap.
- A concave arc is left only when every point of its face is nearer the rim than the chamfer's contact would be. Otherwise the fallback declines, so a chamfer that fits is never silently skipped.
- Each cap's cut is the bevel's right triangle revolved about the axis, with its long side on the bevel line run on past both contacts. It is intersected with the cap's prism, which runs from the cap down past the bevel, so the cut ends where the cap does. The prism stops at the cap: lifted past it, its sides would lie on the rising walls and leave slivers of them.
- The cuts run with `mesh_fallback: false`. The result must be valid and must lose the cutters' own volume (to 1e-3), or the fallback declines.

## Tests

- `chamfer_rim_arcs_under_a_block.rs` builds a rod with a block on it that overhangs the rod by 0.2. Its rim arcs are chamfered at 0.7:
  - The result is valid and watertight, with one cone on each crescent. It takes off the crescents' bevel, `∫ (r - (R - d)) r 4 acos(a / r) dr`, to 1e-6.
  - The same holds with the rod's seam picked too.
  - With an overhang of 1.5, wider than the chamfer, the concave arcs are not left.
- The first two fail without the fallback: the chamfer errors.
- Operations, io and blend tests pass; clippy and fmt are clean.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
