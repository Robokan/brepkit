## What

Two rounds meeting at a junction that is tangent only to a file's precision now share their cross-section, as they do at an exact tangent junction. Before, a zero-area patch closed the gap between them, and the result had one face too many and over-used mesh edges.

## Why

A file stores a line running on round an arc to eight or so digits, so the two meet a few 1e-8 rad off tangent. The two stripes' contacts on a face then end `radius * kink` apart: 2e-7 at r = 5, for a kink of 4e-8 rad.

The trimmer's `mapped_vertex_for_point` merged contact ends only within `VERTEX_TOL` (1e-7), so each stripe got its own vertex on the face. The cross-section registry matches by vertex, so the second stripe registered a fresh cross-section, and the runout stage closed the 2e-7 gap with a patch of no area. The result validated, but its mesh had edges used three times.

The trimmer's edge-hit tests already treat points within 1e-6 as one vertex (`hit.point_3d` against an edge's ends). Contact ends minted on one face now use that allowance between themselves, as `CONTACT_END_TOL`. The face's own vertices still match at `VERTEX_TOL` only: a round just short of its limit ends its contacts that close to a corner it does not reach (`regress_two_edge_exact_limit`, r = 25.4 - 1e-6 on an inch cube, fails if they merge).

## Tests

- New `crates/operations/tests/fillet_tangent_kink.rs`. A slot (a straight side, a half circle, a straight side and a square end) with its first side turned by 0 or 4e-8 rad and its arc stored either way round. Its top is rounded along the arc and one side, or the arc and both sides, at r = 1 and 5. Each result has 9 faces, validates, is watertight, and takes the closed-form volume within 1e-6. The test fails before this change: with the kink, at r = 5, there are 10 faces.
- `regress_two_edge_exact_limit` still passes.
- `cargo test -p brepkit-blend -p brepkit-operations -p brepkit-io` passes.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
