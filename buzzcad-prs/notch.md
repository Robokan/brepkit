A cylinder cut through a plate and ending inside a block above it left the plate's hole open, and the cut fell to the mesh fallback.

The cutter's wall is sectioned by two full circles (the plate's faces) and, apart from them, by an open chain notching its top rim (the block's sides and underside). `split_periodic_face_into_bands` declined any open section, so the face fell to the generic tracer, which threaded the circles and the notch into one loop: the band through the plate was never made. The band splitter now accepts open chains that run from a rim back to the same rim, stay clear of the seam and inside the end band beside that rim (cylinder and cone). That rim takes each chain in place of the arc between its ends, the notch becomes its own piece, and the band's sample point stays clear of the notches. Any other open section still declines as before.

Found replaying a downstream CAD app's recorded booleans: two cuts now match the reference's volume and face mix exactly.

## Tests

- Added `cylinder_cut_wall_bands_split_by_full_circles_beside_a_window` (plate, post and block from primitives, cut by a cylinder; checks a closed manifold result with the exact volume). It fails without the fix.
- `cargo test -p brepkit-algo -p brepkit-operations --lib` passes.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
