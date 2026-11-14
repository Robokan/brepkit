## Summary

Constraint recovery in the CDT flips edges across a constraint until it becomes an edge, then bisects. A vertex lying exactly on the constraint, strictly between its ends, is crossed by no edge, so no flip makes the constraint an edge: it runs through the vertex. When that vertex sits a hair from an end (a face boundary with two vertices 2e-7 apart on one line), bisection cannot pass it either. The recovery gave up after its insert budget, the face fell back to the grid mesher, whose mesh is wrong there, and imported bodies measured wrong (volume and area).

- When flips do not converge, recovery now splits the constraint at such a vertex, as it already splits at a crossing constraint, before bisecting.
- Only a lone vertex. Several on the constraint a hair apart are a cluster of near-duplicates. Splitting through them would chain the constraint into slivers, and the region's fill reads those wrong (a B-spline face came out a fan of 13 triangles). Such a constraint goes to the bisection, as before.

## Tests

- `constraint_splits_at_a_vertex_on_it_beside_its_end`: a vertex 2e-7 from a constraint's end, along an axis and a diagonal. Fails without the change (`ConvergenceFailure` after 280 iterations).
- `constraint_is_not_chained_through_a_cluster_on_it`: five vertices 1.5e-8 apart on a constraint beside its end; no constraint piece shorter than 1e-7 may be made.

math, check, operations, io, algo, blend and topology tests pass; clippy is clean; the pose sweep and truth audit match `main` line for line.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
