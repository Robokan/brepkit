`EdgeCurve::domain_with_endpoints` gives a NURBS sub-span edge the parameters its two ends project to, descending when the edge runs against the curve. It trusted a descending pair only on an open curve; on a closed curve it fell back to the full domain.

On a closed curve a descending pair `(ta, tb)` with `ta > tb` is one of two arcs: the forward one from `ta` across the curve's seam to `tb`, which has no `(t0, t1)` form, or the backward one from `ta` down to `tb`. The second is exactly a piece of a closed intersection loop stored against the loop's direction, which booleans produce. Read as the full domain, such an edge covered the whole loop: every other point of the loop then lay "on" it, and the T-junction split cut phantom edges out of it. The backward sub-arc is now taken when it is the shorter way round (at most half the domain); a pair that only makes sense across the seam still gets the full domain, as before.

Found replaying a downstream CAD app's recorded booleans, as part of making a pin cut across a bore's mouth exact (the rest of that work depends on face-splitter changes not in this PR).

## Tests

- `nurbs_domain_reversed_pair_on_closed_curve_falls_back_to_full_domain` becomes `nurbs_domain_reversed_pair_on_closed_curve_reads_the_shorter_way`: on a closed fitted loop, a reversed pair spanning a fifth of the loop now reads as that backward piece, and a reversed pair whose short way crosses the seam still reads as the full domain.
- `cargo test -p brepkit-topology`, `cargo test -p brepkit-io`, `cargo test -p brepkit-algo -p brepkit-operations --lib` (apart from `compound_cut_edge_tangent_tools_stays_analytic`, which fails now and then in a full parallel run on unmodified `main` too) and `cargo clippy -p brepkit-topology --all-targets -- -D warnings` pass. The pose sweep and truth audit match `main` line for line.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
