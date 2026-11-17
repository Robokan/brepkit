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
- **The speed agent's own tools:** `buzzcad-corpus/tools/speed/` (its
  `README.md` says what each does). `export_slow.py` exports the booleans
  that lose most time to Open CASCADE in a replay as `corpus_bench` case
  folders, and `export_keys.py` named cases; `ab.sh` and `ident.sh` time two
  builds on the same case sets and compare their results byte for byte (a
  speedup must change no result); `prof.sh` samples a run's stacks with gdb
  (no `perf` on these machines) and `rank.py` ranks brepkit's frames;
  `recheck.sh` replays a list of cases one at a time at 300 s. The case sets
  they time, `~/sparkpack/speed-corpus/losers-*` and `bench`, are private
  parts exported from the corpus and live outside the repositories: on a
  new machine, export them again. Give each worktree its own
  `CARGO_TARGET_DIR`: cargo reads a worktree's build as fresh in another
  tree sharing the folder, and the tests then run a mix of both.
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
| 2026-11-14 | BuzzCAD's checks on B-spline booleans: the result's exact volume integrated a trimmed B-spline face's sides along its spline (dv = 0, rounding halved to the rule's depth); they are passed over (`6cac08b3`, check). 168 of 171 volumes the same to the last bit, 3 in the 15th digit | the 57 booleans whose checks took longest in `20261113-142701`, each volume measured alone (results and inputs) | results 120 s, the four worst 10-14 s each | results 57 s, the four worst 10-18 ms; inputs unchanged (81 s -> 79 s) | full replay `20261114-003322` against `20261113-142701` (with the CDT fix, `fb89a2ad`, `afdac6aa`): on the 4,789 booleans passing in both, BuzzCAD's checks 863 s -> 574 s, brepkit with them 1,049 s -> 750 s, the operation alone 186 s -> 176 s; timeouts 52 -> 49; brepkit's boolean operation 1.19x slower than Open CASCADE's in total (1.20x before), faster in 83%. Left: measures of about 3.4 s on other bodies (`4c363346f7bb`, `7b93aa4e4af0`, `ef959c0c3f22`), not looked at |
| 2026-11-14 | The booleans and fillets that lose to Open CASCADE (fillets: the op itself, and BuzzCAD's checks on it). A B-spline projection searched every knot span whose world-axis control box held the point (54 a point on a 262 x 26 fitted surface); each span now also keeps its control box in axes along its own net, and `closest_point_within` passes over a span whose box there lies no nearer than the best point so far (`f593de42`, math, fork-only code). A holed curved face's interior grid tested every point against every boundary segment (1,024 x 64 points against 6,609 on one fillet band: most of `solid_volume`, BuzzCAD's volume-sign check); a grid row's crossings are found once (`bc2c3968`, tessellate; on upstream 4.11.14 its new spline tessellation leaves no such grid, so it gains nothing there and is not sent). A fillet's lie-on test (`stays_within`) projected every sample of an edge 17.8 off its neighbour before refusing it; it stops at the first sample past the tolerance (`fddf42a7`, blend, fork-only code). Every result the same: 240 bench and loser cases' STEP byte for byte, test `row_crossings_answer_as_the_whole_polygon` | the 30 single-solid booleans of the 50 that lose the most time to Open CASCADE, median of 3, base and new in turn; three filleted results' volumes; one fillet | 25.73 s; 0.67-0.76 s each; 1.85 s | 22.32 s (1.15x); 0.55-0.65 s; 0.77 s | full replay `20261114-090830` against `20261114-003322`: no status changed but one timeout that now passes (`d612e398bfe8`), timeouts 49 -> 48; on the 4,857 booleans passing in both, brepkit's operation 181 s -> 176 s, 1.20x -> 1.17x Open CASCADE's in total, with BuzzCAD's checks 783 s -> 737 s; on 347 fillets the operation 13.6 s -> 10.5 s, 1.10x -> 0.55x Open CASCADE's (now faster in total), with checks 59 s -> 52 s. Left: the stalled spans of fitted surfaces (about 32 a point still searched), the two classifiers projecting the same boundary points, the containment test's volume witness (0.6-1.1 s on 8 of the 30), the 20 multi-solid losers (not profiled), and upstream 4.11.14 (held: two fork tests), whose tessellation measures these fillet results 2-3x faster |
| 2026-11-14 | Merged upstream 4.11.14 (#2428: a spline edge or face is divided where it turns). On its own it left imported parts with spline faces open (a few open or over-used mesh edges each) or grid points outside a face: a spline chord that holds the deflection in space need not in a face's (u, v), a bend was cut into samples 1e-6 apart, a closed face's seam was laid on its rim. tessellate: `split_crossing_spline_chords` halves a spline chord that crosses another of its face's outline, has a sample on it, or whose (u, v) middle stands off the curve by more than the deflection; a span under a tenth of the deflection is not cut for its turn; a seam keeps its projected v within a thousandth of the rims' span (sent upstream). Fork-only: the mesh flux wraps periodic (u, v), a hole's seed takes hair vertices last. Tests `thin_spline_lens_mesh.rs`, `spline_dome_seam_mesh.rs`, a short hook | full replay | brepkit 2,705 s (`20261114-090830`) | 1,892 s | `20261114-185906` against `20261114-090830`: 19 more pass (15 failed, 4 mismatch), 2 measures lost (`f841364a7550`, `07095d6fa8dd`: 4 and 2 over-used mesh edges), the 6 new timeouts rerun alone at 300 s (1 passes, 2 reference_wrong, 2 mismatch, 1 still measuring in Open CASCADE). 11 failed -> mismatch: 5 measures now closed, volumes unchanged; 6 rescued fillets BuzzCAD had refused only for their open meshes, which Open CASCADE reads invalid, four of them 6-53% light. BuzzCAD's rescues now drop a result that fails BRepCheck and reads more than 1% off brepkit's volume (`_occ_misread`): those four dropped, all 102 passing rescues kept. Two booleans (`3e50b9bf6c1c`, `aa2e4302a6b8`) now mismatch rather than fail BuzzCAD's checks, with brepkit as the engine only (PRIORITIES #3, #15) |
| 2026-11-15 | The booleans that lose most to Open CASCADE (the 30 worst of `20261114-185906`, exported to STEP; `corpus_bench` now runs bodies of several solids as the bridge does and writes results with `OUT=`). (1) A ray tested every extrusion face of a solid: extrusions had no box in the classifier's face index, so a part with hundreds of extruded spline sides made 4.4M extrusion tests a boolean, each walking 65+ profile intervals. A profile now keeps its control points' box in the plane square to the extrusion, and a ray whose line passes it by more than the tolerance reads nothing at once; a ray along the extrusion reads the 65 even-step points kept with the samples, not evaluated anew (`54696216`, algo). (2) A B-spline face's trim projected a boundary point by a search that settled on a far foot (0.55 off on a point lying on the surface), the next Newton started there and missed too, the edge sampled to its cap and its turn search ran 692 golden-section searches: the nearer of the two feet is kept (`dac37cd3`, algo). (3) The touching-pieces gate meshed each piece twice at one deflection (`83a50077`, operations). (4) A torus face's box candidates (two circles of 360 points along its axis) were each read against the face; 86% already lay in the box (`ab1d5b6d`, operations). Every result the same: the 30 losers' and 210 bench cases' STEP byte for byte | the 30 single- and multi-solid booleans that lose most, median of 3, base and new in turn | 45.96 s (`d612e398bfe8` 9.66 s, `9021aa50579b` 8.33 s, `6a98a59d587f` 2.34 s) | 29.13 s (1.58x; 4.77 s, 2.32 s, 1.11 s) | full replay `20261115-015237` against `20261114-185906`: no regressions, 1 more pass, 3 former timeouts finish (none new); on the 4,801 booleans passing, brepkit's operation 181.5 s -> 160.7 s, 0.85x -> 0.96x Open CASCADE's in total (faster in 84%), with BuzzCAD's checks 549 s -> 559 s (unchanged, under load). Left: `d612e398bfe8`'s NURBS edge crossings in `hole_loops_along_line` (each evaluation re-read the edge's span; `edge_point_at` reads it once: next), `9021aa50579b`'s edge-face projections, `3c9aea16388e`'s collinear-vertex arc splits, the trivial-relation check's point classification |
| 2026-11-15 | The booleans that still lost to Open CASCADE (the 60 worst of `20261115-015237`). (1) A B-spline projection searched about thirty knot spans a point (7.6M Gauss-Newton runs for 256k projections over the 60): over a span turning through a wide angle (a wing skin round its nose) the control net, and so the span's world and own-frame boxes, hold points of the surface far from the span, and a point on the surface lay in the boxes of spans 1 to 15 away. Each span now has the boxes of its Bezier net split twice each way by de Casteljau, read off its own control points by blossoming the first time a search reads it, and a span whose nearest sub-box lies no nearer than the best point is passed over (math, `span_index.rs`). Made up front from the whole surface's Bezier decomposition, each copy of a surface paid for it and three cases ran 10% slower; per span and on demand none does. (2) An edge every point of which lies farther from a B-spline surface than twice the crossing scan's near limit (its piece boxes: a line's eight, a conic's sixteen arcs grown by their sag, a B-spline's Bezier nets, against the sub-boxes) returns no crossings without the scan (algo, `phase_ef.rs`): 3,678 of `d612e398bfe8`'s 3,873 edge/B-spline pairs. (3) A plane face's hole polygons (96 samples a curved hole edge) are sampled once per pass, not for every section line clipped, and the arc crossing search reads its edge's span once (algo, `fill_images_faces.rs`). Every result the same: the 60 losers' and 210 bench cases' STEP byte for byte | the 60 worst booleans, median of 3, base and new in turn; the 210 bench cases, once | 60: 43.27 s (`d612e398bfe8` 4.79 s, `9021aa50579b` 2.31 s, `41ec4923c215` 2.15 s); 210: 18.19 s | 60: 33.87 s (1.28x; 3.63 s, 0.71 s, 1.60 s; the horton wing family 0.70 s -> 0.33 s, twelve cases); 210: 12.89 s (1.41x); no case slower | full replay `20261115-122809` against `20261115-015237`: no regressions, 1 more pass (`4bd1dbbf7e21`, a former timeout); two former timeouts (`9c9a9c6be7ca`, `256e76555317`) now reach their mesh fallback inside 60 s (the exact path fails on base and new alike; 50-56 s -> 16-25 s), `32f6e19bcf80` timed out judging under load and is reference_wrong alone at 300 s as before. On the 4,699 booleans passing in both, brepkit's operation 160.7 s -> 141.7 s against Open CASCADE's 152.8 s: 0.96x -> 1.08x Open CASCADE's speed in total, faster in 86% of cases. Left: `d612e398bfe8` (3.6 s against 1.9 s: B-spline/B-spline seeds, coplanar clipping, solid assembly), `3c9aea16388e`'s collinear-vertex arc splits |
| 2026-11-15 | The 300 booleans that lose most to Open CASCADE in `20261115-122809` (losses are now 62.8 s against 73.1 s of gains; cases of 50 ms to 1 s took 85.5 s against its 54.0 s). (1) A plane x B-spline section's valley walk (`trace_valley`, the floor of a valley of the plane's distance lying on the plane) runs up to 4096 steps each way, settling across the valley by Newton each step, and gives no curve if it runs out. Every walk that ran out had fallen into a cycle two to four states long within its first 64 steps and went round it to the limit, up to 8192 settles for nothing. The walk is a function of its state alone, so its state is kept at each power of two of its steps (Brent's cycle check) and a walk meeting it again stops with no curve, the answer it would reach (`fac6f1a3`, math). (2) The B-spline/B-spline seed grid took a root for every pair of samples; a pair whose square passes both nearest squares and the threshold's padded square changes nothing and takes none (`1950e129`, math). Looked at, left: the trivial-relation check's volume witness (6.0 s over 75 calls in the 300, never refuting) meshes both solids finely on purpose; a coarser volume would change values. Every result the same: the 300's and 210 bench cases' STEP byte for byte | the 300 worst booleans, once, base and new in turn; the 210 bench cases, once | 300: 68.58 s; 210: 13.00 s | 300: 61.67 s (1.11x; the valley cases 0.16-0.25 s -> 0.01-0.10 s); 210: 12.24 s (1.06x) | full replay `20261115-160737` against `20261115-122809`: no regressions (`4bd1dbbf7e21` timed out measuring Open CASCADE's result under load, passes alone at 300 s, brepkit 0.62 s; `32f6e19bcf80` is reference_wrong again). On the 4,699 booleans passing in both, brepkit's operation 141.7 s -> 130.5 s against Open CASCADE's 153.9 s: 1.08x -> 1.18x its speed, faster in 86% |
| 2026-11-15 | The span index upstream (PR #2517, `perf/nurbs-span-index` off upstream 4.11.25). The fork's span index (`055438f1`, 2026-10-18, part of the fitted-loft fixes) was never sent: upstream had since solved the many-span projection its own way (`span_patches` reads every span's control box for each point and sorts them; its descent is not kept within a span, so the fork's per-span closest-point search would change its answers). The PR is upstream-shaped: a `SpanIndex` in the surface's caches (spans, exact control boxes, a BVH, per-span sub-patch boxes on demand) gives `span_patches` the same sorted list from only the spans near the point, and the edge-face pass's clear-edge skip (`3ceb8cb9` here) reads its sub-boxes. Not sent: the sub-box bound in the fork's own closest-point search (`a5e7c10b`), which upstream's search has no place for | upstream 4.11.25 and the branch, the 297 losers and 210 bench cases, once each | 297: 399.4 s; 210: 78.8 s | 297: 368.4 s (1.08x; three cases 8.0-8.3 s -> 2.5-2.9 s); 210: 66.7 s (1.18x); every STEP the same byte for byte; no case slower over five runs | branch: 4,258 tests, clippy, fmt, boundaries and mul_add checks pass; pose sweep and truth audit match upstream's main |
| 2026-11-16 | Merged upstream 4.11.28: #2496 landed, and the span index as the maintainer's #2537, with a projection that now proves its foot the nearest point. That proof made fitted-skin booleans slower (`9021aa50579b` 0.70 s -> 2.89 s), and where it ran out of halvings the mesher lost the boundary point (the wing parts read 0.8% heavy at BuzzCAD's 0.05 mesh). Six speedups on top, each giving the same answer: (1) the proof passes over a span whose sub-patch boxes lie no nearer than its bound, before making its part (math `nearest.rs`, `SpanIndex::sub_gap`); this also keeps it from running out of halvings on those spans; (2) the classifier's trim proves a boundary point's foot to a millionth of the face's size and Newton takes it to 1e-12 (algo `ray_cast.rs`); (3) the B-spline branch of `split_arc_edges_at_collinear_vertices` passes over a vertex clear of the curve's piece boxes before its 80-evaluation search (algo `builder_solid.rs`); (4) `surfaces_apart` reads the two surfaces' span boxes before splitting either into Bezier patches (math `surface_seeding.rs`, `SpanIndex::boxes_apart`); (5) the classifier's on-boundary test bounds a B-spline face's distance by its sub-patch boxes (check `classify/mod.rs`, `SpanIndex::clear_of`); (6) the bounding box does not subdivide a curve piece already inside it (operations `bounding_box.rs`). And a fix: where the proof gives up on a face's boundary point, the mesher takes the unproven point, Newton-refined (operations `tessellate/nurbs.rs`; test `spline_part_coarse_volume.rs`) | merged main and these, the 300 losers and 210 bench cases, once each; seven slow booleans, median of 3 | 300: 96.4 s; 210: 17.0 s; `9021aa50579b` 2.89 s, `3c9aea16388e` 1.76 s (before the merge) | 300: 86.1 s (1.12x); 210: 12.9 s (1.32x); every STEP the same byte for byte; `9021aa50579b` 1.14 s, `3c9aea16388e` 0.54 s, `d612e398bfe8` 3.62 -> 3.16 s (against before the merge) | full replay `20261116-164535`: against `20261116-154026` 2 more pass (the two measures), `d612e398bfe8` a timeout under load (passes alone, 3.4 s); against `20261115-160737`, before the merge, 20 no longer pass, 10 of them already invalid and now caught by upstream's stricter checks (PRIORITIES, merge note). Booleans passing: brepkit's operation 114.4 s against Open CASCADE's 140.7 s, 1.23x its speed, faster in 88%. Left: the wing cuts (`41ec4923c215` 3.4 s against 1.0 s: the proof's halving near a thin trailing edge, inside upstream's proof itself) |
| 2026-11-16 | The booleans that lose most after the merge. (1) Upstream's new check for two plane faces covering the same area (#2512) asks a plane region which side of it a point lies on, hundreds of times along each shared edge, and each query read every B-spline piece's bound again and halved the same pieces again: a piece's bound is worked out once, and its halves are kept once made (topology `planar.rs`). (2) The touching gate cast its ray against every triangle of a piece's mesh: the triangles are held in a grid of their boxes seen along the ray, made once per piece and passed to its interior point (operations `boolean/mod.rs`; a BVH was tried first, and building it cost more than the queries it saved). Every result the same | the 8 new losers of `20261116-154026`, median of 3; the 300 losers and 210 bench cases against main `a8d35f15` | 8: 8.17 s (`295cc99e5c9f` 2.51 s, `0d8fe522f19d` 1.17 s, `d75ce222f2cd` 1.23 s, `caf7ebb4a914` 0.72 s); 300: 86.3 s; 210: 12.9 s | 8: 5.79 s (1.33, 0.59, 0.80, 0.58 s); 300: 85.0 s; 210: 12.4 s; every STEP the same byte for byte | full replay `20261116-181400` against `20261116-164535`: no regressions, 1 more pass. Tests, clippy, fmt, pose sweep and truth audit as before |
| 2026-11-16 | BuzzCAD's checks on a boolean's result, most of which is measuring volumes (S3): on the 180 bench booleans through the bridge, the result's volume and the inputs' took 20.5 s against 12.0 s for the booleans. A solid's faces were integrated one after another, and a big B-spline face's mesh triangle by triangle; both are independent, so each face's term is worked out on rayon's pool, and a face of more than 1024 triangles in chunks of 1024 (each chunk with its own evaluator), and the terms are summed in the same order as before (operations `measure/volume.rs`; off wasm only). Every volume the same to the last bit. Left: meshing one big face is still one thread (its CDT and quadtree) | the volumes of the 436 bench inputs and results, three runs in turn with main; the 180 bench booleans' checks through the bridge | 436: 28.6 s; 180: result 6.9 s, inputs 13.6 s, validity 1.9 s | 436: 15.8 s (1.8x), every volume the same to the last bit; 180: result 4.1 s, inputs 7.1 s, validity 2.0 s | full replay `20261116-231332` against `20261116-181400`: no regressions; `564b042b72e2`, `ccaf1afd4a54` pass (the fix agent's fixes merged before), `dfb8b1ab299c` timeout -> failed (finishes, falls back as before), `9dfcf14b1599` mismatch -> failed (silently wrong before, 16 of 3,000 points; it now falls back, from the fix agent's change). BuzzCAD's checks with the boolean on passing booleans 598 s -> 545 s, measures 557 s -> 544 s, fillets 38 s -> 31 s, at 8 cases at once (the cores were shared; one case at a time the volumes take 0.55x the time). Tests, pose sweep and truth audit unchanged |
| 2026-11-17 | S6, BuzzCAD side (BuzzCAD commit, not brepkit): opening a design, its display data was worked out one body at a time under one kernel lock. (1) The kernel lock is a readers-writer lock (`brepkit_backend.lock` for calls that change the kernel, `reading` for ones that only read it: meshes, measures, face and edge data); the bridge's read calls take `&self` and let go of Python's lock, so they run side by side. (2) `Document.warm_display` and `Scene3D.prepare` work brepkit's bodies on a thread pool (other bodies on the calling thread, as before); the window warms all bodies in one call. (3) `face_normal_at` (the crease test behind `sharp_edges`, 4.65 s of the 6.8 s) measured the edge's middle against every triangle of a curved face's 0.01 mm query mesh, twice an edge: it now measures only the triangles whose bounding ball can come nearer than the nearest-centred one's, the same triangle found (every crease of `lq.buzzcad` identical). Also: the backend's per-shape cache has a lock; conversions to Open CASCADE take turns. S5 tried and dropped: a sphere's CDT interior grid without the curvature floor meshes a 100 mm ball at 0.01 mm in 163,904 triangles, not 394,668, every triangle within the deflection, but a mesh using its whole allowance encloses less: ten tests' mesh volumes fell 0.2-1.9% short, and BuzzCAD takes the mesh's volume where brepkit's exact one differs by over 2% (a 0.5 mm ball would read 4% light), so the dense grid's accuracy is relied on | `lq.buzzcad` (16 bodies, 14 in brepkit) opened read-only with brepkit, display data with no display cache, two runs each, old and new BuzzCAD in turn on one bridge | warm_display 4.05 s, 4.25 s; prepare 0.18 s, 0.19 s | warm_display 1.17 s, 1.15 s (3.6x); prepare 0.11 s, 0.10 s | full replay `20261117-004410` against `20261116-231332`: every status the same, no crash. BuzzCAD's two tests pass |
| 2026-11-17 | S5, BuzzCAD side (BuzzCAD commit, not brepkit): the query mesh (face centres, picking, the mesh volume BuzzCAD checks brepkit's against) was 0.01 mm on every body, so a big curved body took a mesh far finer than its size needs (a 200 mm ball 789k triangles, 1.7 s). It is now 1e-4 of the body's box diagonal, never under 0.01 mm, rounded up to 0.01 mm times a power of two (`query_deflection`): a body under about 100 mm is meshed as before, and a curved face's mesh is as true for a big body as for a 100 mm one (a ball of any size over that encloses 0.025-0.044% too little, against BuzzCAD's 2% check; the angular limit keeps a small feature of a big body round). The crease test behind `sharp_edges` read a face's normal from the query mesh's nearest triangle, so a coarser mesh moved it (up to 25 degrees; one edge of `lq.buzzcad` sits at 62.4 against the 60 degree threshold and read 57.9). The bridge now has `face_normal(face, point)`, the surface's exact normal at its nearest point (the face's sense taken), and the crease test uses it, the mesh kept for a face it fails on. The creases are now exact: the 180 edges of `lq.buzzcad` matched to Open CASCADE's edges agree with its creases to 1e-12 degrees, and 112 of 114 on nine other designs to 0.005 degrees (Open CASCADE reads the body after a STEP round trip; the other two were matched to the wrong Open CASCADE edge, coaxial circles sharing a centre); brepkit's ball B1 has its seams at 0, not 51, and tangent edges at 0, not 1-4. Every design's sharp edges are the same set as before. brepkit's mesher still meshes a sphere about 4x finer than the deflection asks (the CDT grid's curvature floor, which the mesh volumes rely on) | `lq.buzzcad` (16 bodies, 14 in brepkit) opened read-only with brepkit, display data with no display cache, two runs each, the old 0.01 mm forced and the new deflection on one bridge; balls of radius 0.25 to 200 meshed through the bridge | warm_display 1.08 s, 1.08 s; a 100 mm ball's query mesh 394,668 triangles, 0.75 s; 200 mm 788,920, 1.70 s | warm_display 0.45 s, 0.43 s (2.4x; 0.63 s with the coarser mesh alone, the rest the crease test no longer searching triangles); 100 mm ball 98,140, 0.14 s; 200 mm 98,140, 0.15 s | full replay `20261117-074302` against `20261117-004410`: every status the same but one 60 s timeout, a boolean that falls back to a mesh, now failing in the run (alone at 300 s it fails in 35 s, as before). BuzzCAD's two tests pass |
