# Speeding up brepkit for BuzzCAD

This fork (`Robokan/brepkit`) is where brepkit gets fixed so that BuzzCAD
can use it in place of Open CASCADE. Another agent works through the
corpus's wrong results (see [BUZZCAD.md](BUZZCAD.md)). This file is for a
second agent, on its own machine, that makes brepkit **faster without
changing a single result**.

Read BUZZCAD.md's "How the pieces fit", "The loop", "Reading the statuses"
and "Rules" first: they hold for you too. This file says what is different.

## The goal

BuzzCAD gives brepkit 60 s per operation in a replay, and a user waits on
every one in the app. In replay `20261111-150832` (12,736 cases, 8 at once,
on the Linux box):

| operation | cases timed | median | 90th percentile | total |
|---|---|---|---|---|
| boolean | 6334 | 0.021 s | 5.3 s | 13,797 s |
| measure | 1879 | 0.203 s | 7.8 s | 4,358 s |
| fillet | 541 | 0.049 s | 2.5 s | 475 s |
| revolve | 272 | 0.040 s | 0.77 s | 135 s |
| extrude | 3124 | 0.001 s | 0.019 s | 38 s |

and 455 cases timed out, by the step they were in when the 60 s ran out:

| cases | operation | step |
|---|---|---|
| 321 | boolean | running (brepkit's boolean itself) |
| 42 | measure | measuring (brepkit's volume, area and box of an imported body) |
| 25 | boolean | measuring brepkit's result |
| 24 | boolean | judging (sampling points against the inputs) |
| 26 + 9 | boolean, extrude, revolve | measuring Open CASCADE's result: not brepkit's time, ignore |

Those times were taken 8 cases at once, so they are loose; measure your own
with one case at a time (below).

In order:

1. **Boolean timeouts** (321). Most are booleans on bodies with fitted
   B-spline faces (lofted robot shells, hundreds of control points), and on
   large parts with many faces. brepkit's time grows about 2.3x per doubling
   of faces, against about 1.5x for Open CASCADE (measured 2026-10-25 on
   simple shapes): look for work that is quadratic in faces or edges.
2. **Time thrown away on mesh fallbacks.** 1,326 booleans fell back to the
   mesh boolean, and they took 7,927 s of the 13,797 s. BuzzCAD refuses a
   mesh fallback's result, so every second after the exact path gives up is
   wasted. First measure how the time splits between the exact (GFA) attempt
   and the fallback. If the fallback is the bulk, an option in
   `BooleanOptions` to return an error instead of falling back (default
   off, so upstream's behaviour is unchanged), set by the bridge, saves it
   outright. The bridge change is BuzzCAD-side work: see "BuzzCAD side"
   below.
3. **Measure timeouts** (42 + 25). `measure` meshes the solid and
   integrates it. Large B-spline faces go to the CDT, which ran for minutes
   on some fillet bands (BUZZCAD.md, 2026-11-05: "the CDT on two 3 x 438
   bands").
4. **The median.** The typical boolean's time is spread over edge-face
   crossings (23%), building the result (20%), face-face sections (12%),
   result checks (about 10%), same-domain merging (5%) and copies (3%)
   (measured 2026-10-24). The intersection curves themselves are only 2%.

Pick by measuring, not by this list: profile the slowest cases first and go
where the time is.

The corpus also keeps a speed queue: the "Speed" section of
`buzzcad-corpus/PRIORITIES.md` (S1 to S6: spline extrudes and revolves,
boolean time growing with face count, the bridge's result checks, chamfers,
sphere meshes finer than asked, and one kernel call at a time). Take work
from it as the fix agent takes it from the families above it, mark a row in
progress or fixed there when you commit, and add rows for what you find.

## The loop

One change at a time, each taken all the way through, as the fix agent
takes a fix (BUZZCAD.md, "The loop"):

1. **Bring main up to date.** Merge `upstream/main` and `origin/main` (the
   fix agent's pushes) into main before starting, and again before every
   replay.
2. **Pick the work.** From the Speed section of
   `buzzcad-corpus/PRIORITIES.md` (S1 to S6) and from profiling the slowest
   cases (see "How to measure").
3. **Make the change.** Its test is proof that nothing changed: against the
   old algorithm bit for bit where it can be, and the slow cases' outputs
   compared before and after.
4. **Verify** it as "What counts as a speedup" says: the tests, the pose
   sweep and the truth audit, clippy and fmt, the bridge rebuilt, the time
   one case at a time before and after, a full replay with no status
   changed but timeouts (each flip rerun alone at 300 s), BuzzCAD's two
   tests.
5. **Record it.** A row in "Progress" below, a note on the Speed queue in
   PRIORITIES.md, then `scripts/sync-buzzcad-corpus.sh`.
6. **Check in.** Commit and push brepkit main, and BuzzCAD if it changed.
   Fetch and merge first, so the tree pushed is the tree tested.
7. **Send it upstream** at once, not in a batch, but into the open PR for
   its area rather than a PR of its own, so the maintainer has a few PRs to
   read, not one per change (as of 2026-11-13: #2410 B-spline evaluation,
   derivatives and exact volume; #2411 boolean steps; #2412 what a surface
   or curve keeps). Cherry-pick onto that area's branch (a new branch off
   `upstream/main` for a new area), test the branch as a whole, run the
   banned-name grep and `scripts/check-pr-text.sh`, push it to `origin` and
   update the PR's text. A change to code only this fork has stays here.
8. **Follow up.** Answer review comments; when the maintainer lands it,
   merge upstream back into main, then start the next change.

## What counts as a speedup

A speed change is accepted only when **every result stays the same**:

- the five-crate tests pass:
  `cargo test --release -p brepkit-blend -p brepkit-operations -p brepkit-io -p brepkit-algo -p brepkit-topology`;
- the pose sweep and the truth audit print exactly what they printed on
  `main` before the change (diff the outputs; see the `pr-workflow` skill):
  `cargo run --release --example pose_sweep -p brepkit-operations` and
  `cargo run --release --example truth_audit -p brepkit-operations`;
- a full replay shows no case changing status, except timeouts that now
  finish (and those must finish with the status the case had when given
  300 s). A case that changes from pass to anything else is a regression,
  however much faster the rest is. Replays run 8 cases at once, and cases
  near the limit flip between failed and timeout with load: rerun every
  timeout flip alone with `--timeout 300` before calling it a regression;
- clippy and fmt are clean;
- the speedup is shown with numbers taken one case at a time, on one
  machine, before and after, on the same cases.

A change that is faster but moves one case is a bug. Do not loosen a
tolerance, cap an iteration count, coarsen a mesh, or skip a check to gain
time unless every result provably stays the same, and say which in the
commit. Caching and indexing (a BVH where there was a scan, a result kept
instead of recomputed) are the safe kind.

## How to measure

- **Booleans alone, inputs loaded:** `crates/io/examples/corpus_bench.rs`
  takes exported case directories, runs each boolean `REPEAT` times (default
  5) and keeps the median:

  ```bash
  cargo run --release -p brepkit-io --example corpus_bench -- <case dir>...
  ```

  A replay exports every case that does not pass to
  `replays/<time>/failures/<op>/<key>/`. Slow cases, passing or not, are
  in its `results.jsonl` (`brepkit_seconds`); replay those with
  `replay.py --case <key> --speed 5` to time them one at a time.
- **One case, with its log:** `crates/io/examples/corpus_case.rs <case dir>`
  (`LOG=debug` for brepkit's log; it prints which path a boolean took and
  how long the exact attempt ran before giving up).
- **The whole corpus, by tier:** `buzzcad-corpus/tools/profile_corpus.py`
  (run from `../BuzzCAD` with its `.venv/bin/python`) classifies every case
  by the surfaces it works on (tier A planes only to D freeform), times
  brepkit and Open CASCADE one case at a time, and reports where the time
  goes; the speed queue's numbers come from it. For numbers to trust:
  `--times-only --redo --jobs 1` on a quiet machine. Its report goes outside
  the repositories and must not be published (it holds the third engine's
  times).
- **The replay's own timing:**
  `replay.py --speed N` times the booleans one case at a time, the median
  of N runs each, and adds a speed section to the report.
- **Profiles:** the `profiling` skill (`.claude/skills/profiling/`) has
  the flamegraph recipe (`[profile.profiling]` in `Cargo.toml` keeps
  symbols), the criterion benches in `crates/operations/benches/` and the
  perf bugs this code has had before.
- **One machine.** Compare times only between runs on the same machine
  with nothing else heavy running. On Linux, BuzzCAD's bridge is built for
  x86-64-v3 (`source/brepkit_py/.cargo/config.toml`): brepkit's `mul_add`
  is a slow software call without FMA, so build benchmarks with
  `RUSTFLAGS="-C target-cpu=x86-64-v3"` too, or the profile shows a cost the
  app does not pay.

## Working beside the fix agent

Both agents push to this fork's `main`, and both touch `crates/algo` and
`crates/operations`.

- Work on a branch per change, `perf/<what>`, off an up-to-date `main`.
  Merge `main` into it before you verify, and merge it into `main` as soon
  as it passes, so the two agents never drift far apart.
- Keep each change small and about one hot spot. Do not reformat, rename
  or move code you are not speeding up: it turns the other agent's next
  merge into a conflict.
- Before pushing `main`, `git pull --rebase` (or merge) first, then rerun
  the five-crate tests on the merged state.
- Record each change in the table at the bottom of this file (not in
  BUZZCAD.md's progress table, which is the fix agent's).
- Use a target directory of your own per checkout (`CARGO_TARGET_DIR`):
  cargo records path crates by relative path, so two checkouts or
  worktrees sharing one read each other's builds as fresh.

## BuzzCAD side

The bridge (`../BuzzCAD/source/brepkit_py/src/lib.rs`) and `engine.py`
are BuzzCAD's. You may change them for speed (for example, passing a new
`BooleanOptions` field), but keep those changes separate from brepkit's,
never weaken BuzzCAD's checks of a result (`_checked_native`, `_folded`,
the refusal of mesh fallbacks), and list them for the user. In BuzzCAD,
`git pull --rebase` before committing.

## Rules (in addition to BUZZCAD.md's)

- **Engine naming.** Never name the third engine anywhere: code, docs,
  commits, PRs, replies. It is "the third engine". Some replay output names
  it: filter what you print or quote. The commit hook
  (`scripts/check-commit-words.sh`) checks every commit against the private
  word list in `buzzcad-corpus/tools/banned_words.txt`.
- **Pushing `main`.** Before every push of `main`, run
  `git merge-base --is-ancestor 652cd7af HEAD`: it must exit 1 (that
  commit must never come back). Never push commit `c6c055f8`, and never
  push `gh-pages` commit `53e8bdc3`.
- **Commits.** Conventional commits (`perf(algo): ...`), through the
  repo's hooks (`git -c core.hooksPath=.husky commit`), never
  `--no-verify`. Commit and push only when the user asks, or as the user
  has set up for you, and end commit messages with the attribution line the
  user gives you.
- **The corpus is read-only**, except `replays/` (BUZZCAD.md, "Rules"). Long
  replays go against a copy of the corpus (a directory of symlinks to its
  `cases/` and `shapes/`, its own `replays/`), passed with `--corpus`:
  BuzzCAD's exit sync rewrites the corpus's newest replay.
- **Never copy corpus shapes into this public repo**, except a regression
  test's inputs written through brepkit's own STEP writer.
- **Upstream.** Speed fixes go to `andymai/brepkit` as for fixes (BUZZCAD.md,
  "Sending fixes upstream"): one PR per change, off `upstream/main`, with
  the benchmark numbers, `scripts/check-pr-text.sh` printing "clean". The
  earlier speed PRs (#2054, #2055) were merged as sent.

## Progress

| date | change | cases timed | before | after | replay |
|---|---|---|---|---|---|
| 2026-10-24 | (fix agent) NURBS projection near spans, closed-form cylinder/sphere distance, face edge dedupe, bridge built for x86-64-v3 | 147 single-solid booleans, one core | 0.429 s total, 1.18 ms median | 0.241 s total, 0.915 ms median | `20261024-124435`, no regressions |
| 2026-11-11 | On the aarch64 box (FMA native). `BooleanOptions::mesh_fallback`: a boolean can decline the mesh fallback, and BuzzCAD's bridge does (it refused the faceted result anyway; one cut 590 s -> 4.3 s). The containment test before every boolean reads its volume witness last (it measured both solids exactly first, before the cheap witnesses that refute it: 73 s -> 6.6 s, 2.2 s -> 0.59 s declined). NURBS x NURBS chaining passes over chords too far to take a point by their sag (21 s -> 12 s). A NURBS surface's first derivatives without allocating, and once, not twice, in the exact volume integral (230 s -> 134 s). The classifier builds a NURBS face's boundary in (u, v) once, not per ray and per point. Five `perf/` branches; tests, pose sweep and truth audit unchanged on each and merged | 180 passing booleans exported from the replay (60 slowest, 150 sampled), one at a time, inputs loaded | 300.3 s total | 172.7 s with the first four (no case slower by 10%); the slowest five 43.7 s -> 17.0 s with the cache | full replays `20261111-180951` (main) -> `20261111-195244`: 6,154 s -> 3,163 s wall at 8 jobs, brepkit's boolean time 12,239 s -> 5,420 s, timeouts 405 -> 147. No case changed status but timeouts: of 285 that now finish, 189 finish at 300 s on main with the same status and 96 still time out there (94 now fail at once, 2 pass); the 27 new timeouts are load flips (25 as before alone at 300 s) and 2 cases whose input shape is missing from the corpus, which hang in the replay tool on either bridge. Left: the containment test's exact volume when every witness passes (134 s on one cut), point distances in its boundary probes |
| 2026-11-12 | On the aarch64 box. Exact volumes of B-spline faces (Green's theorem, every boundary point integrating the surface from the start of u through each knot span): the line of constant v keeps its basis functions (`NurbsSurface::at_v`), the point and partials are summed in one pass, the first-order basis and quotient rule skip the general algorithm's empty loops, and a whole knot span's Gauss points keep their u basis per face; `first_derivatives` takes the same one pass (every projection's Newton step); `surface_to_bezier_patches` inserts its knots on one grid, not a surface per knot. Every value is bit for bit the old one (tested against the general algorithms; the 226 slowest measure cases give the same volumes to the last bit). BuzzCAD: a boolean's result is measured once in its checks, not twice (`engine.py`); the replay's reader no longer reads a fast case's result as a timeout (`replay.py`: a buffered `readline` after `select` left the result unseen; the previous replays counted 22 and 162 such false timeouts). New example `measure_step`. Three `perf/` branches; tests, pose sweep and truth audit unchanged on each | slowest measure cases, one at a time, through the bridge; a falling-back fitted-loft boolean, inputs loaded, LTO build | 26.4 s and 17.9 s (measures); 40.8 s (boolean) | 7.5 s and 15.4 s (the second a CDT case these changes do not reach); 24.3 s. Over the 226 slowest measures 1,526 s -> 814 s run 6 at a time; one that timed out at 300 s finishes in 116 s | full replay `20261112-024747` against `20261111-195244`: 3,163 s -> 1,973 s wall at 8 jobs, brepkit's boolean time 5,420 s -> 2,970 s, measure 3,124 s -> 2,046 s, fillet 285 s -> 172 s, timeouts 147 -> 70. No case changed status but timeouts, and none newly timed out; all 77 that now finish finish at 300 s on main with the same status. Left: projections' basis divisions in fitted-loft booleans, a constrained triangulation's edge flips in some measures |
| 2026-11-12 | On the aarch64 box. A B-spline face's boundary pieces are integrated on rayon's pool and summed in their order (`check`); a B-spline surface keeps its projection grid and control box, and a curve the points a projection samples on each knot span (`math`); a section's trim to a plane face's lines and a ray against an extruded B-spline face take their curve samples once (`algo`); `merge_split_edges` keeps its tables up to date instead of rebuilding them for every join, its joined edge's direction no longer from a hash map's order (`heal`); the triangulation's edge flip passes over edges apart from the segment by their box before the crossing test and the constraint lookup (`math`). Every value is the one before (volumes compared to the last bit, booleans' outputs line for line). BuzzCAD: the bridge adds up brepkit's own time in its modeling calls (`op_seconds`), and keeps each solid's volume with a fingerprint of what it was measured from; the replay records that time on every case beside Open CASCADE's operation run again on this machine (`occ_seconds_here`), and reports operation against operation. Six `perf/` branches; tests, pose sweep and truth audit unchanged on each and merged; `perf(check)` sent upstream as #2377 | slowest measures, one at a time; fitted-loft booleans declining the fallback; 132 passing booleans, inputs loaded; a three-step boolean chain through BuzzCAD's engine | 24-38 s, 14-15 s (triangulation), 2 measures timed out at 300 s; 91, 128 and 709 s; 81.7 s total; 2.1-2.2 s per step | 2.8-7.4 s, 3.0-3.1 s, 107 s and 218 s; 47, 59 and 376 s; 59.2 s (before the last two changes); 0.9-1.1 s per step after the first (the volume cache) | full replays `20261112-122056` (the other machine's main) -> `20261112-125701`: 2,165 s -> 1,794 s wall at 8 jobs, brepkit with BuzzCAD's checks: boolean 3,186 s -> 2,295 s, measure 2,046 s -> 1,089 s, fillet 172 s -> 93 s; brepkit's boolean operations alone 1,570 s -> 1,349 s; timeouts 82 -> 65. No case changed status but timeouts: the 23 that now finish do so at 300 s on the old bridge with the same status, the 6 new timeouts finish at 300 s as before. Operation against operation (both engines timed here, cases brepkit gets right): brepkit faster in 82% of 4,770 booleans (median 3.3 ms against 14.7 ms), all extrudes, revolves and chamfers; booleans' total 270 s against 153 s, the fitted-loft tail. BuzzCAD's checks are 70% of brepkit's boolean time. Left: fitted-loft booleans (projection Newton steps), revolved B-spline faces' exact volume, fillets |
| 2026-11-12 | The losing booleans (operation against operation, brepkit slower than Open CASCADE on 863 of 4,668 that pass; 181 s lost). A B-spline surface keeps the Bezier patches rays are cast against (`NurbsSurface::ray_surface`; both classifiers built them per face, several times a boolean), its caches now one boxed struct (`math`); a B-spline face's section cover test reads each section's range once (it projected both ends on to the curve at every one of some 190 reads per point, `algo`, fork-only code). Every result the same (four cases' output line for line; tests, pose sweep and truth audit unchanged). Found on the way: a script that exported `CARGO_TARGET_DIR` made `build.sh` install a stale bridge (it copies from its own target dir); that replay was deleted. And timing two builds in turn while the machine's load fell made the second look faster: alternate builds on a quiet machine | 5 losing booleans, best of 3 runs taken in turn with main on a quiet machine | 31.1 s (14.75, 4.85, 2.54, 2.65, 6.26) | ray patches 20.4 s; section ranges 14.6 s; both, through the bridge, 14.75 s -> 2.5 s on the worst | full replays `20261112-125701` -> `20261112-175838`: on the 4,662 booleans passing in both, brepkit's operation 269 s -> 238 s (Open CASCADE 147 s), the seconds it loses where slower 180 -> 153; boolean timeouts 59 -> 43. No case changed status but timeouts (the 16 that now finish do so at 300 s on the old bridge with the same status) and 16 chamfers the fix agent's chamfer fixes pass. Left: the rest of the gap (projection Newton steps, the containment test) |
| 2026-11-12 | Seeding two B-spline surfaces' intersection: `refine_ssi_point` evaluated each surface's point and then built the general order-one derivative table (allocated per call) for its partials; `NurbsSurface::point_and_first_derivatives` gives both in one pass (the point as `evaluate`, the partials as `first_derivatives`, tested bit for bit), and thirteen other callers that read only the order-one table's point and partials take `first_derivatives` (`math`, `check`, `operations`). Tried and dropped (no gain, so not kept): one classifier per operand across the containment test's witnesses (its hot probes already share one), and each basis reciprocal divided once (the compiler or the pipeline hid the divisions) | the two seeding-bound losing booleans, best of 3 runs in turn with main, quiet machine; 60 slow measures | 5.75 s and 5.86 s | 4.05 s and 4.14 s, outputs line for line the same; the 60 volumes the same to the last bit | full replays `20261112-175838` -> `20261112-193718`: on the 4,669 booleans passing in both, brepkit's operation 282 s -> 274 s (Open CASCADE 150 s), seconds lost where slower 192 -> 184. No case changed status (one faces -> timeout finishes alone in 7.6 s as faces). Left: the rest of the gap; most of it is now one Newton projection per candidate span in the span index and its basis functions |
| 2026-11-13 | The losing booleans again (Open CASCADE re-timed alongside). A B-spline surface keeps the points it has projected (`ParametricSurface::project_point`, by the point's bits, up to 16,384 a surface: several classifiers projected the same face boundaries into (u, v) in turn); the span index is the surface's own wherever it is read (two readers built their own per call); the last few Bezier splits are kept process-wide, found by a surface's data bit for bit (a boolean's result rebuilds its faces' surfaces, so a body cut by tool after tool split the same surfaces for each tool), at most 50,000 patches; caches print as nothing in `Debug` (an upstream test compares faces by their printed surfaces). Upstream: the 14 single PRs folded into three by area (#2410, #2411, #2412) | 132 passing booleans, best of 2; 7 slow fitted-loft booleans, best of 3 in turn with main; a body cut by 13 tools | 48.1 s; 1.77, 2.04, 1.86 s; 33.8 s | 36.6 s; 0.97, 1.07, 1.08 s; 24.0 s, outputs line for line the same | full replay `20261112-235049` against `20261112-193718`, run while test suites loaded the machine (Open CASCADE's own total rose 150 s -> 209 s), so compare the ratio: on the booleans passing in both, brepkit's operation against Open CASCADE's 1.83x -> 1.38x slower in total; brepkit faster in 82%, medians 4.1 ms against 18.0 ms. No status changed but timeouts (the 13 new ones rerun alone at 300 s) and one fillet the fix agent's fillet fix passes. Left: one Newton projection per candidate span in the span index |
| 2026-11-13 | The booleans brepkit lost worst (seconds against Open CASCADE's tenths). Two B-spline surfaces' sections are kept process-wide, found again by both surfaces' data bit for bit, the grid and the step (`intersect_nurbs_nurbs`; one boolean met the same pair six times, each seeding 163,000 close grid pairs), up to 2^19 points and control points in all; the grid seeds' Newton refinements run on rayon's pool and are taken in their pairs' order, a seed's duplicates found among those within a cell of it (`SeedCells`, the same yes or no as the scan of every seed); the edge-face pass surveys every pair it examines (on the surface, or its crossings) on rayon's pool before it starts, as adding vertices leaves curves and surfaces as they are (`survey_pairs`); a Bezier split leaves a row whose weights are all exactly 1 in place rather than taking it to homogeneous form and back for every knot (`insert_along_rows`, tested bit for bit against inserting knot by knot, rows of 1 among rows not). `corpus_bench` starts a thread before timing: a process that never started one allocates without locks, which made the old build look 40% faster on a small case than it is in the app | the 180 single-solid bench booleans, one process each, old and new in turn, quiet machine | 37.0 s; the two worst 4.07 s, 4.02 s | 25.8 s (1.44x); 0.51 s, 0.46 s; all 210 bench cases' results the same byte for byte | full replay `20261113-091154` against `20261112-235049`: on the 4,176 booleans passing in both, brepkit's operation against Open CASCADE's 1.345x -> 1.33x slower in total (the cases fixed are few; most of the gap is spread over many); brepkit faster in 81%, medians 4.5 ms against 13.5 ms. No status changed but one timeout, which passes alone (0.67 s, 1.07 s before). Left: 66 slow booleans not yet looked at (`df5c475fcd4c` 3.8 s against 0.7 s, `6a98a59d587f` 3.0 s against 0.1 s), and about a dozen at about 1 s that are projections onto B-spline faces in the classifiers |
| 2026-11-13 | Merged upstream 4.11.13 (upstream's multiply-add in two steps, `madd`, everywhere; the fork's own library `mul_add` calls moved to it too, as upstream's new CI check requires) and the bug-fix agent's main. The new rounding tipped a tie in the face splitter's planar arrangement: it orders the edges at a vertex by their chords, and a disc's rim arc whose chord lies on the line of a slot's chord and the sections at its ends left the vertex in the same direction as a section, so one slotted pose of `disc_over_segment_holes` fell back to the mesh. Chords that tie are now ordered by the arcs' own directions, and the even-odd pass measures the outer face with its arcs, as it measures the regions (test `rim_arcs_whose_chords_run_along_a_line_bound_their_own_regions`). Tests, pose sweep and truth audit: upstream's line for line | full replay, 12,924 cases, 8 at once | - | - | `20261113-142701`: against the bug-fix agent's replays after its merge (`-112432`, `-103623`, `-103438`, `-103616`) nothing lost but `4bd1dbbf7e21`, a timeout under load that passes alone in 0.66 s; against `20261113-091154` (before the merge) 9 booleans lost to the rounding, the bug-fix agent's known flips, and 4 measures silently wrong (`4b96fe4617e9`, `5ea2e4947f9e`, `0e47e9d21fd1`, `71ec9620f956`; each exact again with a fused multiply-add; PRIORITIES #2). Booleans both pass: brepkit 1.20x slower than Open CASCADE in total (1.33x before), faster in 83% |
