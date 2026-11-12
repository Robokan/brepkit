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
