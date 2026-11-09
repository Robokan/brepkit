## Summary

A pointed cone's wall is a cone face whose wire runs up its seam line to the apex and back. When such a wall's outline is notched, its mesh comes from the seam unwrap in the CDT path. That unwrap moves the seam's return copy a period on from its outgoing copy.

A file can start the wire anywhere. When the wire starts on a rim rather than on the seam, the stretch after the seam keeps the u the unwrap through the apex gave it, a period off the copy it starts from. The boundary then spans more than a period, and the wall meshes over area it does not have.

One example is a nearly flat cone with its outline stepped out across u = 0, away from its seam:

- it measures 40.9 by its exact area;
- it meshed at 66.7;
- the solid's mesh did not close where its neighbours meet it.

The walk was already started from a seam edge for a wall whose seam a hole notches (two seam edges). Now every pointed cone's wall is started from its seam. The notched wall's own handling of the seam's sides is unchanged.

## Test

`tessellate::tests::pointed_cone_walked_from_a_rim_meshes_its_own_area` builds a cone face walked from a rim arc:

- the seam at u = 1.5 and the rim at slant 2;
- a tab out to slant 2.5 for u in [-0.7, 0.7], bounded by straight B-spline rulings, as a file writes them.

Its mesh must hold the surface's area, cos(a) (π v1² + 0.7 (v2² − v1²)), to 1%. Without the change it meshes 20.12 for 12.41.

Operations tests pass.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
