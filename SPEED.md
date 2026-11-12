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
