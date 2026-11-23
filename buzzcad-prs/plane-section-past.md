## Summary

A plane x B-spline section is kept in runs where its gaps reach the region round both faces. A gap reaches the region when its chord's padded box meets it, or when the grid cell it crosses meets a knot span whose control box does. A span's control box reaches well past the section through it, so a run kept by its cells alone ran far beyond the faces. That left the trim a longer curve to cut, and a block cut into a notched B-spline plate fell back to a mesh.

Where chords meet the region, the run is now theirs, plus one sample beyond on either side. Where no chord meets the region (a bump between two samples), cells alone still keep the run.

- `RegionReach::gap_meets` is split into `chord_meets` and `cell_meets`.
- `runs_through_region` narrows each run that has chord gaps.

## Tests

- `nurbs::intersection::tests::a_plane_section_kept_in_a_region_runs_one_sample_past_it` fails on main and passes here.
- The math, topology, algo, blend, operations and io tests pass on this branch.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
