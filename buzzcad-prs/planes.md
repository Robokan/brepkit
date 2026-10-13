**Depends on the shell orientation holes PR** (its commit is included here; review only the second commit).

A STEP face may sit turned against its plane: its surface normal facing into the solid, the face's sense false. The reader kept that plane, set the face's reversed flag and wound its loops about the inward normal. brepkit builds a plane facing out and unreversed, its loops wound about that normal, and the boolean assembler reads a planar face's orientation from its loop. On a part read with many such planes, the assembler judged the shell inward and failed with "no outer shell found". A face turned against its plane now takes the plane flipped instead (normal and offset negated, loops wound the other way). Surfaces that cannot flip, such as a bore's cylinder, keep the reversed flag.

Found replaying a downstream CAD app's recorded booleans: three housing fuses and cuts now match the reference exactly, and eleven more results lose their extra faces (coplanar faces now merge once their orientations agree). On its own this change turns one holed part's cut from exact to the mesh fallback, which the holes fix it depends on corrects.

## Tests

- Added `planes_written_facing_in_read_facing_out`: a box whose six planes are written facing in reads with every plane facing out, unreversed, each loop counterclockwise about it, valid, with the right volume. It fails without the fix.
- `cargo test -p brepkit-io` passes.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
