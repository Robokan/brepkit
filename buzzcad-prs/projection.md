`project_point_to_curve` sampled every knot span of the curve in its coarse search before refining. Fitted curves (marched intersection sections, fitted lofts) have dozens of spans, and `EdgeCurve::domain_with_endpoints` projects both ends of a NURBS sub-span edge onto its curve on every call, so these projections dominated booleans that create such sections.

A span's piece of the curve lies inside the convex hull of its p + 1 control points while their weights are positive, so the distance from the point to those control points' bounding box is a lower bound for every point of that span. A span with any weight of zero or less can leave that box, so it gets a zero bound and is always sampled. The coarse search now visits spans nearest box first and stops at the first span whose box lies beyond the closest sample found so far: that span, and every one after it, cannot hold the closest point. For a point on or near the curve, which is what edge domains ask for, this samples a handful of spans instead of all of them. The seeds handed to Newton come from the same per-span samples as before, and a sample's neighbours across a span that was skipped are simply not compared.

Measured on a benchmark of 147 booleans recorded from a downstream CAD app (single core, inputs already loaded): the slowest cases went from 27 ms to 6 ms and the total from 0.42 s to 0.32 s. Results are unchanged: the pose sweep and truth audit match `main` line for line.

## Tests

- Added `projection_keeps_a_span_with_a_negative_weight` (from review: a quadratic with a negative weight whose exact hit lies outside its span's control box).
- Added `projection_on_a_many_span_curve_finds_the_closest_point` (a helix fitted through 60 points; 40 points on, near and far from it must project no farther than the closest of 20,000 samples along it).
- `cargo test -p brepkit-math`, `cargo test -p brepkit-algo -p brepkit-operations --lib` (apart from `compound_cut_edge_tangent_tools_stays_analytic`, which fails now and then in a full parallel run on unmodified `main` too) and `cargo clippy -p brepkit-math --all-targets -- -D warnings` pass.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
