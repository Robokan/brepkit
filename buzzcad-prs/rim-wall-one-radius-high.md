## Summary

A closed rim between a plane and a cylinder wall, rounded at exactly the wall's height, has its contact on the wall land on the wall's other rim. Two examples:

- a pin as long as the round's radius, its end rounded over;
- a blind hole as deep, its mouth rounded.

No wall is left: the round runs from the cap to that rim. Before this change:

- the plane/cylinder torus declined a radius at the wall's reach, to a file's digits either way;
- the rim's rebuild refused a contact landing on the far rim ("would land past the wall bounding rim");
- the round fell back on a walked band, which left the wall a strip of no height: a face too many on the pin, and on the hole an edge the band used once, so the incidence audit refused it.

Now:

- the torus takes a closed rim whose wall contact lands on the far rim, within 1e-6 times the wall's radius;
- `closed_rim_info` takes it when that rim is one closed circle about the wall's axis, of the wall's radius, at the contact, and the wall has no other edges than the two rims and their seam;
- `assemble_closed_rim` then rebuilds the cap as before, leaves the wall out of the result, and runs the band from the plate contact to the far rim. The band takes the rim as the wall did, its sense read against its own surface.

## Test

`crates/operations/tests/fillet_rim_wall_one_radius_high.rs`:

- a pin of radius 3 and height 2, its top rim rounded at r = 2 and at r = 2 (1 - 1e-8): 3 faces;
- a 20 x 20 x 10 plate with a blind hole of radius 3 and depth 2, its mouth rounded at r = 2: 8 faces.

Each result must:

- validate;
- mesh watertight at two deflections;
- take off the closed-form volume to 1e-4: the round's section, (1 - π/4) r², swept round the axis at its centroid.

Without the change, the pin has 4 faces and the hole fails the incidence audit.

Topology, blend, operations, io and algo tests pass.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
