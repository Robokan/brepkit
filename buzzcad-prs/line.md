A plane × cylinder line section was kept when it met both faces' bounding boxes, even when it missed the plane face itself.

An L-shaped wall's bounding box spans its notch, so a cutter's generator lying only in the notch passed the box test and was kept as a section. Together with a plate's two full circles it cut the cutter's wall into a grid no splitter could trace, and the cut came out open. The banded-partner filter now also reads the line against the plane face's true outline (`line_face_intervals`) and drops a line the face misses entirely. A line the face meets is kept whole as before, so the band splitting that the existing comment protects is unchanged.

Found replaying a downstream CAD app's recorded booleans: six cuts now match the reference's volume and face mix exactly.

## Tests

- Added `cylinder_generator_in_an_l_walls_notch_is_no_section` (a plate and an L-shaped wall from primitives, cut by a cylinder whose lowest generators lie in the wall's notch). Without the fix the cut keeps 5,027 mm³ it should remove.
- `cargo test -p brepkit-algo -p brepkit-operations --lib` passes.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
