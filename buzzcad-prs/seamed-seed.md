## Problem

`normalize_face_normals` reads the convention (which way a face's boundary walks about its effective normal) from the seed faces, then triple-flips the result faces that disagree. It skips every face whose wire uses an edge twice, seeds included. A cylinder wall round a closed rim is such a face: its wire runs up the seam and back down it.

Where the only faces left as they were are hole walls of that kind, no seed gives a reading, and the result faces vote (#2299). In the case that showed this, a plate was rounded at r = 30 along both its outlines, 16 edges. The untouched faces were three hole walls, and the rounds had more bands built backwards (16) than faces built right (12). The vote turned every right face inside out:
- brepkit's own volume of the result was 14.0M for 25.3M;
- the result faced inward throughout.

## Change

`orientation.rs`: a seed whose wire runs along a seam both ways reads its winding from its boundary's signed area in the surface's `(u, v)`. The loop has no winding about its samples' centroid in space, but it closes in `(u, v)`. Such a seed sets the convention and is never turned. Seamed faces that are not seeds are still skipped.

## Tests

- New unit test `a_seamed_seed_sets_the_convention` in `orientation.rs`: the manifold unit cube with four of its six faces turned inside out, and a seamed cylinder wall as the only seed. Without the change the wall gives no reading, the faces vote, and the two right faces are turned. With it the four turned faces are turned back and the wall is left alone.
- `cargo test -p brepkit-topology --features test-utils`, `-p brepkit-blend`, `-p brepkit-operations`, `-p brepkit-io` and `-p brepkit-algo` pass, and clippy is clean.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
