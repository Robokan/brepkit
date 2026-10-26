# Fixing brepkit for BuzzCAD

This fork (`Robokan/brepkit`) is where brepkit gets fixed so that
[BuzzCAD](../BuzzCAD) can use it in place of Open CASCADE. BuzzCAD is a
parametric CAD app for robots. BuzzCAD records every modeling operation it
does with Open CASCADE. Your job is to take the newest recordings, find
where brepkit gets those operations wrong, and fix brepkit.

## How the pieces fit

```
sparkpack/
  BuzzCAD/   the app (Python).  Do not change it except as described below.
    source/brepkit_py/       the Rust bridge (PyO3); builds against THIS fork:
                             Cargo.toml has path deps on ../../../brepkit/crates/*
    tools/brepkit_corpus/    record_examples.py, replay.py
    source/extensions/buzzcad/buzzcad/kernel/corpus.py   the recorder (format)
    source/extensions/buzzcad/buzzcad/kernel/engine.py   how BuzzCAD calls brepkit,
                             and the checks a brepkit result must pass
  brepkit/   this fork
    buzzcad-corpus/          submodule: the private Robokan/buzzcad-corpus repo,
                             every machine's recordings and replays merged
~/Library/Logs/BuzzCAD/brepkit-corpus/   this machine's recordings (the corpus)
  cases/<key>.json  shapes/<sha1>.bin  replays/<time>/
```

### The checked-in corpus

`buzzcad-corpus/` is a submodule holding a private repo, because the shapes
are real robot parts: a case's result is the part as it stood after that
operation. `Robokan/brepkit` is public, so never copy shapes or STEP files
from the corpus into it, except the few a regression test needs.

BuzzCAD runs the sync script itself when it exits after recording new
cases, if this fork is checked out next to it (see `kernel/corpus.py`;
`BUZZCAD_CORPUS_SYNC=0` turns it off, output in
`~/Library/Logs/BuzzCAD/brepkit-corpus-sync.log`). Run it by hand after a
replay to check the replay in.

On a new machine, run `git submodule update --init buzzcad-corpus` after
cloning. `scripts/sync-buzzcad-corpus.sh` pulls the corpus repo, adds this
machine's recordings and replays, then commits and pushes them. It only adds
files, and cases and shapes are named by content hash, so machines never
clash. On a machine without BuzzCAD it does nothing.

### What gets recorded

The user's BuzzCAD records every Boolean, Extrude, Revolve, Fillet,
Chamfer and Shell it does with Open CASCADE, in every session. Each case
holds:

- the inputs and Open CASCADE's result, in Open CASCADE's binary format;
- the operation's parameters, and the edges or faces that were picked.

## The loop

Run these commands from `../BuzzCAD`. It uses its own Python: `.venv/bin/python`.

1. **Build the bridge against this fork.** Run this after every brepkit change:

   ```bash
   PYO3_PYTHON=$PWD/.venv/bin/python bash source/brepkit_py/build.sh
   ```

2. **Replay the newest recordings.** The corpus grows as the user works.

   ```bash
   .venv/bin/python tools/brepkit_corpus/replay.py               # everything
   .venv/bin/python tools/brepkit_corpus/replay.py --newest 300  # the latest only
   .venv/bin/python tools/brepkit_corpus/replay.py --op fillet --case 3fa2
   ```

   Read `replays/<time>/report.md`. It has three parts:
   - counts by operation and status;
   - the commonest problems, each with an example case;
   - "Since <the last replay>": which cases are fixed and which regressed.

   `results.jsonl` has the details for each case.

   Then, from this repo, check the recordings and the replay in:

   ```bash
   ./scripts/sync-buzzcad-corpus.sh
   ```

   To replay every machine's recordings rather than this machine's alone,
   add `--corpus ../brepkit/buzzcad-corpus` to `replay.py`.

   If you want more cases from the example files, run:

   ```bash
   .venv/bin/python tools/brepkit_corpus/record_examples.py
   ```

3. **Pick the next problem and reproduce it here in Rust.** Take it from
   the corpus's work queue, `buzzcad-corpus/PRIORITIES.md`: the top open
   family first (it ranks silently wrong results, then failures, then face
   counts, by how often each hits real work), and mark the family in
   progress or fixed there when you commit. If the queue is empty or older
   than the newest replay, take the commonest real problem instead. Each
   case that doesn't pass is exported to `replays/<time>/failures/<op>/<key>/`:
   - `case.json`: the operation, its parameters and the picks. Picks are
     indices into the input's edge or face map, plus a point on each pick.
   - `input0.step`, `input1.step` and so on: the inputs.
   - `occ.step`: Open CASCADE's result.

   Load the inputs with brepkit-io's STEP reader and run the operation.
   `../BuzzCAD/source/brepkit_py/src/lib.rs` shows how the bridge calls
   each operation and what options it passes. Turn the case into a
   regression test in the crate that owns the bug, and copy the STEP files
   in as test data.

4. **Fix brepkit.** Follow this repo's `CLAUDE.md`: the layer rules,
   `scripts/check-boundaries.sh`, the tests and the commit style. Keep
   each fix small and upstreamable, because the goal is to send fixes back
   to brepkit.

5. **Check the fix.** Run the crate tests, rebuild the bridge (step 1), and
   replay everything (step 2). A fix only counts if:
   - its cases now pass;
   - "Since ..." shows no regressions;
   - BuzzCAD's own brepkit tests still pass:

     ```bash
     .venv/bin/python source/qt/buzzcad_qt/tests/test_brepkit_native.py
     .venv/bin/python source/qt/buzzcad_qt/tests/test_corpus.py
     ```

6. **Record progress** in the table at the bottom of this file, then go
   back to step 2.

## Reading the statuses

| status | meaning | what to do |
|---|---|---|
| pass | same solid as the case's reference answer (volume, area and bounding box within 0.1%, same face count) | nothing |
| faces | same solid, but a different face count. Usually brepkit leaves faces split that should be merged, or adds slivers. | fix it, lower priority |
| mismatch | a different solid. The judge says brepkit is wrong, or nothing independent could decide. | fix it. With judge "unknown", work out by geometry which one is right first |
| failed | brepkit errored, or BuzzCAD's checks rejected its result. The reason says which. | fix it |
| crash / timeout | brepkit panicked, segfaulted or hung. `worker.log` has the output. | fix it, high priority |
| reference_wrong / occ_wrong | they differ, and the judge says the reference's result is the wrong one | **do not change brepkit to match it.** Note it for the user |
| both_wrong | neither result looks right | look, then note it |
| unsupported | brepkit or the bridge can't take this input yet | see "Bridge limits" below |
| occ_failed | Open CASCADE failed on it | brepkit succeeding here is a bonus |

### Some reasons, with where to look

- **"brepkit fell back to a mesh boolean".** brepkit's exact GFA boolean
  failed, and it returned a faceted approximation. The bridge refuses those
  results. The bug is in `brepkit-algo` or `operations/boolean`: find out
  why the exact path failed.
- **"result failed brepkit's validity check (... inconsistent face
  orientations)".** brepkit's own checker found a bad result: an
  operations bug.
- **"result is not a closed surface" and "folds back on itself".** These
  are BuzzCAD checks. The first catches fillet or chamfer corners left as
  pockets; the second catches zero-thickness slivers. Look in `brepkit-blend`.
- **"import: parse error ... empty wire".** `brepkit-io`'s STEP reader
  refused a valid STEP file.

## Rules

- **The reference is not the truth.** A case is judged against its
  reference answer: the one stored with the case where there is one, else
  Open CASCADE's result. Every engine has bugs (Open CASCADE's measures are
  off on some closed and periodic faces, for one). Never make brepkit match
  the reference just because it is the reference. When the results differ,
  `replay.py` runs a judge that uses neither engine's result:
  - booleans: sample points classified against the inputs;
  - extrude and revolve: their volume formulas;
  - all results: a validity check.

  The verdict is in `results.jsonl` under `"judge"`. If the judge can't
  decide, reason about the geometry (`occ.step` against your result) before
  you "fix" anything. A replay after the references change shifts statuses
  for that reason alone: read its "Since..." with that in mind, not as
  regressions or fixes.
- **Don't make cases pass by weakening BuzzCAD's checks.** That means
  `_checked_native` and `_folded` in `engine.py`, and the bridge's refusal
  of mesh fallbacks. Those checks exist because brepkit's broken results
  passed its own validator. The same goes for loosening the replay's
  tolerances.
- **Bridge limits are BuzzCAD-side work.** One example is "unsupported:
  input: N solids where one was expected": the bridge takes one solid per
  input, and multi-solid bodies are common. You may fix this in
  `../BuzzCAD/source/brepkit_py/src/lib.rs` or `engine.py`. Keep those
  changes separate, and list them for the user.
- **The corpus is read-only.**
  - Never delete or edit anything in `~/Library/Logs/BuzzCAD/brepkit-corpus`
    except `replays/`.
  - Never open and save the user's `.buzzcad` files.
  - `~/Documents/Humanoid400 Splines.buzzcad` must never be modified.
- **Don't kill the user's BuzzCAD.** `build.sh` installs the bridge as a
  new file, which is safe while BuzzCAD runs. BuzzCAD picks up a new bridge
  when it restarts.
- **Don't commit or push** in this repo or in BuzzCAD until the user asks.
  When they do, end commit messages with the attribution line they give
  you.
- **License.** brepkit is AGPL-3.0, and so is the bridge.

## Sending fixes upstream

Fixes go to `andymai/brepkit` as one PR per fix, from branches off
`upstream/main` (never from this fork's `main`, which carries fork-only
files). Follow the `pr-workflow` skill. Upstream bans the reference kernel's
name in code, commit messages and PR text, so word around it ("some STEP
writers", "a reference kernel"); leave BuzzCAD and corpus names out too.
Before every push of a PR branch, and before opening or editing a PR, run
the fork-only check as well as the skill's banned-name grep, with the PR
text in a file; it must print "clean":

```bash
scripts/check-pr-text.sh <branch> <pr-body.md>
```

Its word list is private (in the corpus submodule); a missing list fails the
check rather than passing it.

**In flight.** As of 2026-10-25, 10 of the 12 PRs below are merged upstream (released in 4.2.3-4.2.5); #2046 and #2053 are still open. Seven PR branches are pushed to `origin` (Robokan/brepkit),
each `upstream/main` plus one fix, and all seven PRs were opened on
2026-10-22 (#2045-#2051), without auto-merge. Their descriptions are in
`buzzcad-prs/`.

| branch | body | status |
|---|---|---|
| fix/shell-orientation-holes | shell.md | [#2045](https://github.com/andymai/brepkit/pull/2045) merged; tested, sweep and audit unchanged |
| fix/step-outer-loop-by-area | outer.md | [#2046](https://github.com/andymai/brepkit/pull/2046) open; tested (2026-10-20) |
| fix/step-vertex-loop-sphere | sphere.md | [#2047](https://github.com/andymai/brepkit/pull/2047) merged; tested (2026-10-20) |
| fix/step-planes-facing-out | planes.md | [#2051](https://github.com/andymai/brepkit/pull/2051) merged; tested (2026-10-20); stacked on shell-orientation-holes |
| fix/cylinder-wall-rim-notches | notch.md | [#2048](https://github.com/andymai/brepkit/pull/2048) merged; tested, sweep and audit unchanged |
| fix/plane-cylinder-line-outside-face | line.md | [#2049](https://github.com/andymai/brepkit/pull/2049) merged; tested, sweep and audit unchanged |
| fix/ring-face-sample | ring.md | [#2050](https://github.com/andymai/brepkit/pull/2050) merged; tested, sweep and audit unchanged |
| fix/step-nurbs-edge-same-sense | same-sense.md | [#2052](https://github.com/andymai/brepkit/pull/2052) merged (2026-10-24); new writer unit test (the fork's round-trip test needs a fork-only cut) |
| fix/heal-merge-round-holes | heal-round-holes.md | [#2053](https://github.com/andymai/brepkit/pull/2053) open (2026-10-24); sweep and audit unchanged |
| perf/nurbs-projection-near-spans | projection.md | [#2054](https://github.com/andymai/brepkit/pull/2054) merged (2026-10-24); new many-span projection test; sweep and audit unchanged |
| perf/surface-distance-closed-form | surface-distance.md | [#2055](https://github.com/andymai/brepkit/pull/2055) merged (2026-10-24); new equivalence test; sweep and audit unchanged |
| fix/closed-nurbs-reversed-span | closed-nurbs.md | [#2056](https://github.com/andymai/brepkit/pull/2056) merged (2026-10-24); sweep and audit unchanged |

"Tested" means clippy clean and `cargo test -p brepkit-algo -p
brepkit-operations --lib` passing (1197 tests) on that branch alone; for
the io branches, `cargo test -p brepkit-io`. On 2026-10-20 all seven still
merged cleanly onto `upstream/main` (4.2.2 + 11 commits), the banned-name
grep was clean on every branch and body, and the pose sweep and truth
audit matched `upstream/main` line for line on the four algo branches
(the audit's two `!` lines, a rod through a ring, are upstream's own). The
fork's `main`, with all seven fixes together, passed the full io, algo and
operations suites (2084 tests).

Next:

1. Watch the open PRs. An AI reviewer (cubic) and Copilot comment within
   minutes: `gh api repos/andymai/brepkit/pulls/<N>/comments` and
   `gh pr view <N> --repo andymai/brepkit --comments`. Fix real findings on the
   PR branch (in `.worktrees/upstream-prs`), push to `origin`, and answer the
   rest. Do not merge or set auto-merge: the PRs come from the fork, and
   merging is the maintainer's call. `gh pr edit` fails on a GitHub
   deprecation error; patch a body with
   `gh api -X PATCH repos/andymai/brepkit/pulls/<N> -F body=@<file>`.
2. Batch two (opened 2026-10-24 as #2052, #2053, #2056, with two speed PRs #2054, #2055; all from Robokan, commits as eric.d.vaughan@gmail.com so the CLA credits Robokan). Still to send: the band mesh declining a folded rim (`11744679`), which needs a standalone test (its only test is a fork-only cut). Originally: batch two, each its own branch off `upstream/main`, checked the same way
   (tests, pose sweep and truth audit, banned-name grep), from the fork's
   commits of 2026-10-20: the STEP writer's `same_sense` (`e3fd82db`), the
   band mesh declining a rim that folds back (`11744679`), the coplanar merge
   with round holes (`c3eb7b7c`), and the closed-NURBS span reading in
   `domain_with_endpoints` (part of `9f9d08b1`, with its unit test).

### Continuing on another machine

- Clone with the corpus: `git clone --recurse-submodules https://github.com/Robokan/brepkit.git`
  (the corpus submodule is private; the account needs access to
  Robokan/buzzcad-corpus).
- BuzzCAD sits next to it (`sparkpack/BuzzCAD`) with its `.venv`; the bridge
  builds against `../brepkit` by path.
- A new machine has no recordings of its own under `~/Library/Logs`, so
  replay the checked-in ones:
  `.venv/bin/python tools/brepkit_corpus/replay.py --corpus ../brepkit/buzzcad-corpus`.
- On Linux (set up 2026-10-13 on the `bizon` box, Python 3.10):
  - BuzzCAD records here too, at the same path:
    `~/Library/Logs/BuzzCAD/brepkit-corpus`, and syncs it on exit.
  - Rust is in `~/.cargo/bin`, which is not on PATH: `export PATH="$HOME/.cargo/bin:$PATH"`.
  - Make the venv with BuzzCAD's README line (`python3 -m venv .venv`, then its
    `pip install`). Do not also install `cadquery-ocp`: it writes over the
    `cadquery-ocp-novtk` that build123d needs, and OCP then crashes.
  - The Linux OCP wheels have no `OCP.OCP.collections`. `replay.py` now falls
    back to `TopTools_IndexedMapOfShape`, as `corpus.py` already did; that
    change is BuzzCAD commit c49cd60. Without it every case "fails"
    with a ModuleNotFoundError. A replay like that must be deleted from
    `replays/`, or the next replay's "Since" compares against it.

## Progress

Baseline: 2026-10-13, brepkit 4.1.49, 309 cases from BuzzCAD's example and
library files.

| date | pass | faces | mismatch | failed | crash | unsupported | what changed |
|---|---|---|---|---|---|---|---|
| 2026-10-13 | 170 | 33 | 0 | 24 | 0 | 82 | baseline: 21 mesh-fallback booleans, 2 STEP "empty wire" imports, 1 inconsistent orientation; the 82 unsupported are multi-solid inputs (bridge) |
| 2026-10-13 | 170 | 36 | 0 | 21 | 0 | 82 | io: a planar face with only FACE_BOUNDs takes its largest loop as the outer one (OCC writes the hole first, and the reader made the hole the face). 3 fallbacks now exact; they are "faces" (the pin's end disks are not merged into the plate) |
| 2026-10-13 | 185 | 36 | 0 | 21 | 0 | 82 | 324 cases (15 new). algo: a cylinder or cone wall cut by full circles and also notched at a rim splits into bands, the notch its own piece (before, the band through a drilled plate was lost and the hole left open). 2 atlas_e1 cuts now pass. Next in that family: circles crossed by a rim-to-rim ruling (a grid split, 4 cases) |
| 2026-10-13 | 187 | 36 | 0 | 19 | 0 | 82 | io: a ball written as one sphere face bounded by a VERTEX_LOOP reads as make_sphere's two hemispheres (was "empty wire"). Both import failures now pass, exactly matching Open CASCADE. Noted: `measure::oriented_solid_volume` reads these sphere results as negative; the bridge's own mesh volume is right |
| 2026-10-13 | 201 | 25 | 0 | 16 | 0 | 82 | io: a plane written facing in (face turned against it, as Open CASCADE writes far sides) reads as brepkit builds one, facing out and unreversed. algo: the assembler's shell orientation readings count a planar face's holes (they read the outer loop alone, so a holed part far from the origin read inward: "no outer shell found"). 3 "no outer shell" failures and 11 "faces" now pass; no regressions |
| 2026-10-13 | 207 | 25 | 0 | 10 | 0 | 82 | algo (phase_ff): a plane x cylinder/cone line section that misses the plane face's true outline is dropped (only the faces' boxes were checked, and an L-shaped wall's box spans its notch). The spurious generator had cut the cutter's wall into a grid with the plate's circles. 6 atlas_e1 cuts now pass; no regressions. Left: 8 mesh-fallback booleans, 2 fillets |
| 2026-10-13 | 208 | 26 | 0 | 8 | 0 | 82 | algo (builder): an unsplit planar face's classification sample avoids its holes, and its offsets are sized by its curves (a ring bounded by two circles has one vertex per loop, so it was sampled at its centre, in its hole, read Inside a disc fused into it, and dropped). 2 fallbacks now exact (1 pass, 1 faces); no regressions. Left: 6 mesh-fallback booleans (4 are a box pressed flat on a holed plate, holes crossing the contact outline), 2 fillets |
| 2026-10-13 | 234 | 26 | 0 | 9 | 0 | 83 | 352 cases (28 new, recorded on the Linux machine deep-thought: 26 pass, 1 failed, 1 unsupported); first replay there, replay `20261013-153819`, no brepkit change, no regressions. New failure: revolve `d043e3c5b6f5` comes out inside-out (negative volume). Left: 6 mesh-fallback booleans, 2 fillets, 1 revolve |
| 2026-10-13 | 234 | 26 | 0 | 9 | 0 | 83 | operations: revolve refuses a planar profile whose plane is perpendicular to the axis ("sweeps no volume"); it used to build an empty solid. Case `d043e3c5b6f5` is such a profile (a rectangle in z = 0 turned about Z): Open CASCADE's result is a zero-volume shell of two coincident annuli, so the case stays "failed", rightly. scripts: the corpus sync kept no replay's failures/ when this machine had no replays of its own (BuzzCAD's exit sync wiped the newest export); it now keeps the corpus repo's newest. Replay `20261013-161510`, no regressions. Noted: `compound_cut_edge_tangent_tools_stays_analytic` fails in a full parallel `cargo test -p brepkit-operations --lib` on this Linux box with or without this change (a process-wide fallback counter), passes alone |
| 2026-10-14 | 721 | 86 | 6 | 104 | 0 | 260 | 1177 cases (825 new, nearly all recorded on the Mac on 2026-10-13); replay `20261014-100117` of the merged corpus, no brepkit change, no regressions. New: 6 mismatches where the judge says brepkit is wrong (3 distinct: `d6a4d89d605f`/`efed7080b8ca` and `02c5ad0a2438`/`3b4858778639` are ~7% too much volume with ~1150 of ~2950 sample points wrong; `f468531e84e1`, `8fef2d961f98` differ by 0.3% and 0-2 points). These pass BuzzCAD's checks, so with brepkit as the engine they are silently wrong parts: fix first. Then 101 mesh-fallback booleans, 86 "faces", 2 fillets, the revolve (rightly refused). The 260 unsupported are multi-solid inputs (bridge) |
| 2026-10-14 | 725 | 88 | 4 | 100 | 0 | 260 | algo (builder_solid): `merge_duplicate_edges` merged edges by their two ends alone, so a hole's arc and a box's straight top edge across the hole (same two points when the hole's seam lies below the box's top) became one edge; the box's strip in the hole and the wall above it then had one edge set, read as a doubled face, and both were dropped (~7% too much volume, silently). Lines, circles and ellipses now also have to share their middle (within a quarter of their size, so a faceted ball's chords still join their arcs); closed and NURBS edges match by their ends as before. `f468531e84e1`, `8fef2d961f98` mismatch -> faces (19 vs 18: the hole's wall is still cut along an invented full circle at the box's side face); 4 mesh fallbacks now pass. Replay `20261014-131744`, no regressions. Noted: a primitive plate whose hole seam is on its side falls back (the hole's far rim is split in halves on the wall, whole on the plate) |
| 2026-10-14 | 725 | 88 | 0 | 104 | 0 | 260 | operations (stopgap, boolean result check): a cylinder or cone face whose hole runs round the axis is refused. Two equal cylinders crossing left each wall as one face with the two section loops as "holes" (a face with no inside, read wrong by Open CASCADE and the mesher; brepkit's own volume only looked right through a closed-form special case for exactly this shape). The 4 mismatches (`d6a4d89d605f`, `efed7080b8ca`, `02c5ad0a2438`, `3b4858778639`) now fall back, so BuzzCAD uses Open CASCADE for them. Replay `20261014-134104`, no regressions. The exact Steinmetz tests are `#[ignore]`d until the real fix: split the section loops where they touch and band-split each wall into its two arms |
| 2026-10-14 | 729 | 88 | 0 | 100 | 0 | 260 | algo: two cylinders of one radius whose axes cross now meet in their exact section, two ellipses in the planes bisecting the axes, as eight quarter arcs between the points where the cylinders touch (an open arc reads as its shorter way round, which a half turn lacks). The face splitter takes the four paths between the touch points, pairs the lower and the upper of each side into the two saddles that wind the wall, and splits the wall into its two arms and the two lenses (`split_periodic_face_by_touching_saddles`, the band builder factored out of `split_periodic_face_by_winding_chain`). Fuse, cut and intersect are exact at their closed-form volumes; operations' closed-form volume for the old two-holed-walls result is removed. `d6a4d89d605f`, `efed7080b8ca`, `02c5ad0a2438`, `3b4858778639` now pass (they had fallen back under the stopgap, which stays as a guard). Replay `20261014-141753`, no regressions |
| 2026-10-14 | 736 | 89 | 0 | 92 | 0 | 260 | algo (face splitter), the holed plate + box family (33 fallbacks: a box pressed into a holed plate, its side through a hole's axis, so one of its cuts along the hole's wall lies on the hole's seam): a split on a cylinder's seam line keeps that copy's u (projected, the far copy's pieces took the near copy's u and ran diagonally across the face); a cylinder's untouched rim, cut at its seam's antipode only to lay the wall out, is joined back whole as a cone's already was (the plate keeps it whole); and a closed rim split where sections end moves a whole turn to the sections' turn when every section ending on it agrees and its ends then meet more of the seam copies beside it. 7 fallbacks now pass, 1 is "faces"; replay `20261014-153128`, no regressions against `20261014-141753`. Noted: the same fuse with the box's footprint wholly inside the plate still falls back (a planar holed face whose internal loop crosses the hole); `ce05f81542ff`, `c928dbbeef48` and the other 25 of the family still fall back |
| 2026-10-14 | 751 | 92 | 0 | 74 | 0 | 260 | algo (face splitter): one u window for a cylinder wall whose seam copies are a period apart. A rim walked against its curve can be laid a turn off that window, and sections sit at their points' own u, which need not be in it either; parts a turn apart never join, and the wall was never split. Every rim run that sections end on, and every section, now moves by whole periods into the window (replacing the narrower rim-only rule; a rim no section ends on keeps the walk's layout, which the tracer relies on in mirrored poses). 15 fallbacks now pass, 3 are "faces"; replay `20261014-162859`, no regressions. Regression test `crates/io/tests/hole_chord_box_fuse.rs` reads the case's two operands from STEP (primitive operands did not reproduce it). Next: the flush box on a holed face (4 non-manifold chords where a box edge crosses a hole's opening; tightening the edge merge's allowance to keep the hole's short rim arc apart from the box edge turns these into silent mismatches and breaks 5 tests, so the fault is upstream of the merge: the flush face's box-footprint loop crosses two holes' openings and is taken as an internal loop with the holes left whole; routed to the general path instead, the face splits but drops out of the result. A hole-weaving fix, not attempted further yet) |
| 2026-10-14 | 772 | 92 | 0 | 53 | 0 | 260 | algo: two cylinders with parallel axes now meet in exact lines along them (phase_ff; the analytic cylinder pair only took crossing axes, and the marcher returned each line as overlapping fitted pieces short of both rims), and a line along a whole cylinder wall's axis with both ends between its rims is kept whole on that wall (the boundary clip's planar fallback dropped it). The ring-of-holes cut family (a cylinder through a ring of small parallel holes): 21 fallbacks now pass; replay `20261014-172530`, no regressions. Tests `crates/io/tests/ring_cut_parallel_cylinders.rs` (case `5a4c21ee7f50`'s operands from STEP; a primitive plate with one hole the big cylinder crosses still falls back, the small hole's outer arc not shared between the plate and the hole's wall) |
| 2026-10-14 | 784 | 92 | 0 | 41 | 0 | 260 | algo (face splitter): a planar face's round hole that a curved section ends on joins the arrangement, as one a line section ends on already did (a cylinder cut through a ring of round holes: its circle's arcs run from hole to hole, each ending on a hole's rim; with the holes attached whole every arc dangled, was dropped, and the face came out whole). 12 fallbacks now pass; replay `20261014-211914`, no regressions. Test `crates/io/tests/hole_ring_round_holes_cut.rs` (case `d50d09d9a335`'s operands) |
| 2026-10-14 | 788 | 96 | 0 | 33 | 0 | 260 | algo + operations: a spherical cap's seam meridian, which its wire runs up to the pole and back as a file writes a cap, is exempt from the out-and-back spur cleanups as a pointed cone's seam already was (the builder dropped the cap as a slit face; operations' `remove_wire_spurs` stripped the seam). 4 fallbacks now pass and 4 are "faces"; replay `20261014-214518`, no regressions. Test `crates/io/tests/sphere_cap_seam_fuse.rs` (case `a5ac05565707`'s operands; a dimple cut from brepkit's own sphere has no such seam and never failed). Open: a ring hole that a bigger cylinder crosses 0.02 from the hole's seam (`5ad5…`-like cuts, e.g. the 32-free-edge group) splits into a sliver, a strip and the rest, and the rest's interior point (from its unwrapped pcurves) lands in the strip, so it is dropped. Sampling cylinder pieces from their 3D curves instead fixed 9 cases but broke 4 others and 9 tests, and using that outline only to veto the old point broke as many; reverted |
| 2026-10-15 | 1061 | 132 | 2 | 37 | 0 | 354 | 1586 cases (409 new). algo (face splitter), cylinder walls whose arcs and rims came out a turn off: a horizontal arc's end, projected into the surface's own window, is now the first copy its UV line runs through (an arc leaving u = 0 towards -u was read the long way round); a whole rim's half-turn halves no longer fold in the interior-point polygon (its unwrap read a half-turn step either way, so the sample landed in the next piece and the piece was dropped); and a curved section whose end meets a boundary vertex in 3D but no copy of it in UV moves by the one whole turn that joins it. 10 fallbacks now pass, among them 3 of the ring-hole cuts crossed near the hole's seam (the 32-free-edge group) and the box sunk into a holed plate whose top crosses a hole; replay `20261015-162815`, no regressions against `20261014-214518`. Tests `crates/io/tests/hole_band_box_fuse.rs` (case `cb58299c12a3`), `crates/io/tests/seam_ring_cut.rs` (case `af9dc02715c2`). New in this corpus, not yet looked at: 2 fillet mismatches, 6 booleans that "fold back on themselves" |
| 2026-10-15 | 1063 | 132 | 0 | 37 | 0 | 354 | blend: a set-back trihedral fillet corner whose three contacts lie on the rolling ball is now that ball (a sphere face, framed clear of its poles and seam); it was a biquadratic NURBS patch off the sphere, so a box rounded on every edge came out 0.15% light, silently (both fillet mismatches, `3d36df2f397e` and `1b8a92ee3bf0`, a 10 x 10 box filleted r = 1 all round; the judge could not decide, the closed form says brepkit was wrong). Both now pass; replay `20261015-164705`, no regressions. Test `crates/operations/tests/rounded_box_corners.rs` | Noted for the user: the 6 "folds back on itself" booleans (all `atlas_real`, e.g. `54877922c7d8`) are not a brepkit fault: the faceted operand already has 56 face-to-face folds, and Open CASCADE's result and brepkit's both carry the same 56; BuzzCAD's `_folded` check flags any fold, inherited or not. In progress, not checked in: the flush box over round hole openings (10 cases) splits right once the footprint loop is not taken as an internal loop when its sides run through hole vertices, the promotion reads holes arc-true, a half-turn rim piece is not T-split, the loop walker ranks running on round the same circle as straight, and the edge merge's loose (25%) match joins only copies still lacking a partner; `6f994390e6ae`, `3b1f715f7a92` then pass, but `circleinsert_socket_fuse_is_strictly_valid` fails, so it is held back |
| 2026-10-16 | 1085 | 135 | 0 | 151 | 0 | 374 | 1771 cases (185 new, nearly all `atlas_real` booleans of a robot shell whose walls are fitted NURBS lofts, 667 x 33 control points, bulging past their rims, with boxes, cylinders and its own offset). Baseline replay `20261016-163100`: 1073 / 134 / 163 failed / 27 timeouts. math: plane x NURBS sections are kept only where both faces' boxes meet and refined there (densified, interpolated to 1e-6; a 32-point grid over a 667-span patch left section ends 0.07 off, so the loops round a box never closed), and a closed section no longer loses its last stretch; a span index (knot spans by control box, in a BVH) gives exact line hits, curve x surface seeding (boundary seeds 115 s -> 3 s) and a projection the 9 x 9 coarse grid no longer misleads (boundary points projected up to 186 mm off). algo: a NURBS face's box covers its control net; the classifier reads a NURBS face on its surface (span-indexed ray hits, trimmed by a ray along +v that counts crossings modulo the seam) instead of the flat polygon of its rims; a NURBS face's extent is that trim, holes included; an open plane x NURBS section across a curve-rimmed plane face is windowed; a cylinder band's piece between two rim-to-rim sections is a region, not a hole; a bore circle crossing a plane face's curved edge is split there. blend: a fillet trim no longer copies the whole topology (BuzzCAD's one kernel keeps every earlier mesh-fallback result, ~550k faces each, and fillets took ~5 s). 12 of the 14 "inside-out" box/disc intersections now pass, 1 is "faces"; replays `20261016-180623`, `-202059`, `-224253`, no regressions. Tests `crates/operations/tests/loft_wall_booleans.rs` (box at a loft bulge; the disc-through-the-wall case is `#[ignore]`d: a band whose far rim runs against its curve is laid out a turn off, which a corpus-faithful disc hits; making closed cylinder rims start at their seam vertex fixed it but broke `hole_band_box_fuse`, so it is not in). Noted for the user: `3bff94d33f` (a fuse) times out in the replay only because measuring and judging the exact NURBS result takes ~3 min; with a long timeout it is a "mismatch" where Open CASCADE's union measures more than its two inputs together (524436 > 497835 + 23168), so likely occ_wrong. 7 fallback cases now time out (the bigger NURBS boxes expose NURBS x NURBS pairs, 4-7 s each). Open: the bored-shell family (`26ffe0466ef2` and kin: the bore's sections on the outer wall end on the boss junction but route as internal loops, so boss pieces come loose); NURBS x NURBS sections refitted 1e-2..1e1 off; brepkit's own volume of these parts is ~3x off (the NURBS mesher caps its grid) |
| 2026-10-18 | 1446 | 145 | 0 | 294 | 0 | 2 | 1912 cases (141 new). BuzzCAD (bridge, commit `eb9f630`): a boolean whose operands are several solids now runs on them all (fuse by overlapping groups, cut each solid, intersect pairwise, empties dropped) and returns a compound, and the replay imports booleans the same way. 372 of the 374 "unsupported" now run: +361 pass, +10 faces. Replay `20261018-170246`, no regressions; 25 timeouts (no column here), all fitted-loft booleans |
| 2026-10-18 | 1472 | 145 | 0 | 321 | 0 | 0 | 1940 cases (28 new). Merged upstream v4.2.2. Its projection searched every knot-span patch of a point off the surface, which made a fitted-loft boolean take 18 s; a surface with many spans is now searched on its cached span index. Its STEP reader now starts a closed circle at its vertex on the seam, and the boundary walk had laid the wall after such a rim a turn off (7 holed plate + box fuses fell back); it now reads that rim in the direction it is walked. Replay `20261018-214841`, no regressions against `20261018-203329` (the merge before the walk fix, which lost those 7). Against `20261018-170246` the counts shift for a BuzzCAD reason, not a brepkit one: its new freeform gate (`ba2ab48`) sends any body with B-spline faces to Open CASCADE, so all 25 fitted-loft timeouts, and `a4499bb1008a`, which passed, now show as "failed: a body with bspline faces"; that skipping is also most of why the replay took 268 s rather than 4232 s. The 2 unsupported (`6722a30d97d5`, `e7588373be95`) now run and are `occ_failed` (brepkit falls back to the mesh boolean too) |
| 2026-10-20 | 1646 | 28 | 0 | 253 | 0 | 0 | 1984 cases (44 new, from the Mac). BuzzCAD (`tools/brepkit_corpus/replay.py`, not committed): the replay now runs brepkit on B-spline bodies too, past the app's freeform gate (`--freeform-gate` keeps the gate); the app itself is unchanged. Baseline with the gate off, replay `20261019-160517`: 1512 pass, 152 faces, 52 timeouts (all B-spline booleans). heal: `unify_same_domain` merges coplanar faces with round holes (it deferred any group with a closed-circle loop, so a plate's face left split around a fused box stayed two faces); loops are outlined by curve samples and classified by a point on their boundary, not their centroid (which can sit in a hole): 124 "faces" now pass. The pin-across-a-bore's-mouth cut family (a vertical pin straddling a wall where a horizontal bore opens; ~45 fallbacks): algo phase_ff splits a plane x cylinder/cone ruling at a round hole's rim (it ran on through the mouth); topology `domain_with_endpoints` reads a reversed projection pair on a closed NURBS curve as the backward sub-arc when that is the shorter way round (it read the whole loop, so the T-junction split cut other points of the loop into a section piece and minted phantom edges); the face splitter samples a NURBS section on its own span when splitting it, splits any section crossing a cylinder's seam line there (with its own pcurve per half), and a closed rim anchored on the seam is laid where the walk reaches it. pave filler: a rim arc crossing an analytic curved face at its two ends but standing off it in between (18% of its chord, a tube's end circle across a wider post) is no longer taken as lying in the face. tessellate: the structured band mesh declines a rim that runs back on itself in u (it stitched the fold across, meshing the right solid to the wrong volume). io: the STEP writer writes `same_sense = .F.` for a NURBS edge running against its curve (another reader took the long way round the loop: 6 cases exact in brepkit read back wrong). Against the gate-off baseline: 124 "faces" and 10 failures now pass. Replays `20261019-193521`, `-220202`, `20261020-001200`, no regressions against any. Tests `crates/operations/tests/pin_through_hole_mouth.rs` (16 seam poses, one `#[ignore]`d: hole seam 270, pin seam 180 still falls back), `crates/io/tests/pipe_post_fuse.rs` (case `c74d6594176e`), `crates/io/tests/pin_mouth_step_roundtrip.rs`. Open: the corpus pin cuts through a plate (`f1159b33711c` family) still fall back: the pin's band in the plate is dropped by the greedy wire walk (its seam copies quantize to one key); a rim wholly a turn outside the wall's window broke a mitred-rod pose when moved in, so it is left |
| 2026-10-22 | 1661 | 38 | 0 | 241 | 0 | 0 | 2004 cases (20 new, from the Mac: 6 fillets crashed). math: curve, surface and 2D-curve evaluation used stack buffers sized for degree 8 and panicked on a degree-14 B-spline read from STEP (the 6 crashes, in import); past that degree they take the heap, and the cached surface evaluator defers to the surface (test `crates/math/tests/high_degree.rs`). The 6 are now `occ_failed` (Open CASCADE fails too; the bridge does not find the picked edges). algo (face splitter), a pin through a plate: the plate cuts the pin's wall along two whole circles from the seam vertex, where both seam copies meet in one trace vertex, and the band between them was dropped. Each whole circle is split in thirds (its UV run cut with it), and with circles split and the walker's loops broken, the face trace's partition is adopted on a wall laid out in one window; a patch of a periodic wall bounded by sections alone (a block's side across the pin) is told from its hole twin by winding, not counted a band by its lines; a wall whose seam is at u = 0 walks from a seam line. Replay `20261022-023804`: against `20261020-001200` (the last committed state) 6 failures pass, 10 are "faces", no regressions (`939e72d9b0d9` timed out at 60 s, as slow as before: 58.5 s); test `crates/io/tests/pin_through_plate_and_wall.rs` (8 poses through STEP, one `#[ignore]`d). Tried and held back: reading a reversed closed rim from its end (in the boundary walk or the rim split) lays bores' far rims in the wall's window and made 31 of 46 nine-pin cuts exact (`f1159b33711c` family), but the 7 plate+box fuses (`8cdb580ca6b9` family) then split a hole wall into a piece no neighbour shares, and a mitred rod pose came out short; next to fix |
| 2026-10-23 | 1680 | 38 | 0 | 221 | 0 | 0 | No new cases (BuzzCAD's replay now runs 8 cases at once: 876 s). algo, the far rim held back on 2026-10-22: the boundary walk now reads a closed rim walked against its curve as the closed-rim split does, its turn running from its start_uv (it had laid a bore's far rim a turn below the wall); on a cylinder laid out in one window a closed rim's turn is moved by whole periods into the window, or left as walked; and the under-split rescue drops a face-trace loop made only of the face's own boundary run backwards, a pocket of the outside the face's wire encloses on the glued wall (a slot cut along a bore across its seam, which the trace had returned as a piece of the wall that no neighbour shared: the 7 plate+box fuses' failure once their rims were laid out right). Replay `20261023-105929`: 19 failures pass, no regressions against `20261022-023804`, `20261021-232908` or `20261020-001200` (`758b0a17a4b9` timed out at 60 s, as slow as before: 57.9 s); 31 of the 46 nine-pin cuts are now exact end to end. Tests `crates/io/tests/slotted_bore_end_fuse.rs` (the slot's seam on its floor; with the seam on the slot's walls or over the bore it still falls back, `#[ignore]`d), `pin_through_plate_and_wall.rs` (all 8 poses now) |
| 2026-10-23 | 1687 | 36 | 0 | 216 | 0 | 0 | No new cases. algo (phase_ff): a plane x cylinder/cone ruling now stops at any hole of the plane face, not only a round one (a pin along a part's underside crossed the square opening where a boss stands under it, and the line ran on through the opening, splitting the pin's wall where no face met it). 5 nine-pin cuts (`dadf226fd459` group) now pass, matching Open CASCADE's volume to 1e-4, and 2 "faces" pass; replay `20261023-160045`, no regressions against `20261023-105929`. Test `crates/io/tests/pin_under_a_boss.rs` (4 seam turns through STEP). Found on the way, not fixed: built in memory (no STEP), turn 180 of that test is exact but 12 edges' faces disagree in orientation, because `make_cylinder` turned about its axis keeps its rim circles' parameter 0 at the surface's u = 0, a turn-fraction from the seam vertex, so the boundary walk lays both seam copies at one u; starting closed circles at their vertex (in `domain_with_endpoints`, or only in the cylinder walk) fixes it but breaks 5 test files (keyhole knuckles, mitred rod, rod through plate edge, a fillet), which rely on the old layout. Next: the slot-end wall of `db755a4189cc` (a bore re-cut through a blind bore's end: the wall's notch arc and the section's lower arc share both ends and the walker keeps the notch); the `6a70ada37e0b` group (a closed NURBS section's seam-split half reads a turn off) |
| 2026-10-23 | 1687 | 39 | 0 | 213 | 0 | 0 | algo, a blind bore re-cut through its end (`db755a4189cc` group: a pin along a bore that stops at a channel's end wall, the bore's axis 0.095 above the channel's ceiling, so the wall's top edge is notched by the bore's major arc and the pin's minor arc below the ceiling shares both its ends): a planar face's own boundary arcs now get arc-true pcurves (the shorter-arc pcurve traced the notch as the lower arc, so the walker read both arcs leaving the vertex alike); a holed planar face takes the face trace when the walker closes a section on its own reverse (the walker keeps the rightmost turn, the notch, where the boundary turns away and the section goes in); and the trace pairs a section's own halves as twins before pairing anything else (the notch, coming first, took the section's forward half). 3 failures (fallbacks) now "faces" at Open CASCADE's exact volume and area, 97 faces vs 93: each re-cut bore's wall is left split along the pin's seam line, which lies on it. Replay `20261023-165732`, no regressions against `20261023-160045`. Test `crates/io/tests/blind_bore_recut.rs` (the case's part and pin from STEP; built from primitives the part does not reproduce it, and those re-cuts fall back in 3 of 4 pin seam turns with or without this change; also, building that part in memory, the blind bore cut itself falls back) |
| 2026-10-23 | 1692 | 39 | 0 | 208 | 0 | 0 | algo (face splitter), a box fused flat onto a drilled face, overhanging it (5 fallbacks: `0d57426903b9`, `d1e4e73086fa` and kin): the box's bottom splits round the footprint, then the holes' rims are carved in as discs capping the holes, each going to the first piece whose outline holds it and whose holes do not. The footprint piece, from the internal-loops path, carries its UVs in a frame of its own, so its outline read degenerate in the face's frame; the discs went to the ring round it, which kept the rims as holes beside them (each rim used three times). `distribute_cap_circles` now reads each piece's loops in the face's frame from their 3D points. All 5 pass, matching Open CASCADE's faces and volume; replay `20261023-173715`, no regressions against `20261023-165732`. Test `crates/operations/tests/box_on_holed_plate.rs` |
| 2026-10-23 | 1702 | 39 | 0 | 197 | 0 | 0 | algo, the flush box over round hole openings held back on 2026-10-15 (a box fused flush onto a drilled face, the footprint's edges through holes' centres; 10 fallbacks, `6f994390e6ae`, `3b1f715f7a92` and kin): the footprint loop is no internal loop when its sides run through hole vertices, the promotion reads holes arc-true, a rim piece of exactly half a turn is not T-split (its shorter-arc reading may take either half), and the edge merge joins copies sharing their middle first, then lets a set still lacking a partner join one alongside it (a hole's short rim arc and a box edge's chord across the opening, each already shared by its own two faces, had welded into one edge of four). The held-back fourth part, the walker ranking a run on round the same circle as straight, is dropped: it was what broke `circleinsert_socket_fuse_is_strictly_valid` (and now the keyhole knuckles, the gridbin feet and a slotted-plate fuse), and the 10 pass without it. All 10 pass; replay `20261023-184144`, no regressions against `20261023-173715` (`d216eaa1ec8e`, a fallback at 58.4 s before, now runs past the 60 s limit: a timeout rather than a failure, still a failure). Test `crates/operations/tests/box_flush_over_hole_openings.rs` |
| 2026-10-23 | 1704 | 39 | 0 | 196 | 0 | 0 | algo (face splitter), a rod with a crossbar fused on its top (`90e99aefddb9`, `ce074e9d40e2`: a short wide cylinder across the rod's end, its caps cutting down through the rod's wall): on each cap the cap's rim, split at the feet of the rod's two lines, keeps a major arc whose chord crosses one line. The cap's trial planar arrangement broke that line at the chord and registered the break for the curved faces before its pieces were dropped for the walker's, so the rod's wall split the line alone there and its pieces met nothing. Breaks now reach the registry only from an arrangement whose pieces are kept. Both pass; replay `20261023-233817`, no regressions against `20261023-184144`. Test `crates/operations/tests/rod_under_a_crossbar.rs` (the rod turned 90 or 270, every crossbar turn; with the rod at 0 or 180 it still falls back in memory, the rim-layout fault noted above) |
| 2026-10-24 | 1704 | 41 | 0 | 194 | 0 | 0 | algo (builder_solid), a box sunk 1 into a drilled plate, its floor and roof crossing holes (`bafee87b8dbe`, `1997f6ee6e6c`): below the floor a crossed hole keeps a short strip of its wall and the floor's chord strip across it, a pair that meets the rest through edges sharing their ends with the hole's arc and the box edge's chord. The shell grouping counts edges by their ends, so the arc and the chord filled the count first and each pair became a cavity shell of its own (the exact result, at Open CASCADE's volume, was refused). A face across the very same edge now joins while that edge has fewer than two faces in the shell. Both now "faces" (27 vs 25: each strip stays apart from the hole wall below it); replay `20261024-004141`, no regressions against `20261023-233817`. Test `crates/io/tests/box_sunk_into_drilled_plate.rs` (the case's operands from STEP; built from primitives, in memory or through STEP, the fuse never hit it) |
| 2026-10-24 | 1977 | 42 | 0 | 276 | 0 | 0 | 2401 cases (397 new); BuzzCAD's replay now takes reference answers stored in the corpus as a further opinion, and a new status, "empty" (19: the inputs only touch). Speed, measured with `crates/io/examples/corpus_bench.rs` on the 147 single-solid cases the engines all got right on the Mac (one core, inputs loaded): 0.429 s total, 1.18 ms median before; math: a NURBS projection samples only spans whose control box can hold the closest point (fitted section curves have many spans; the slowest cases 27 ms -> 6 ms); algo phase_ef: a cylinder's and a sphere's distance in closed form, not by projecting (median -13%); topology: a face's edges and vertices deduped by a short scan, not a hash set (~1%); BuzzCAD bridge: built for x86-64-v3 on Linux (`source/brepkit_py/.cargo/config.toml`, not committed; brepkit's `mul_add` was a software call without FMA; -22%). Now 0.241 s total, 0.915 ms median (1.8x and 1.3x; on the M1, where FMA is native, about 1.35x and 1.15x). Measured: the intersection curves themselves are 2% of the time (plane x cylinder already exact; only cylinder x cylinder fits curves), so exact intersections would help accuracy more than speed; a typical boolean's time is spread over edge-face crossings (23%), building the result (20%), face-face (12%), result checks (~10%), same-domain (5%), copies (3%). Replays `20261024-115457`, `-124435`: no regressions, 4 former timeouts pass; near-limit mesh fallbacks (45-57 s) flip between failed and timeout with load |
| 2026-10-24 | 1987 | 42 | 0 | 267 | 0 | 0 | algo (phase_ff), a bore cut through a plate into the boss fused to its back, tilted 2.3 degrees off the boss's axis and running just inside its wall (10 fallbacks, `e729142fd1bd` and kin, all `atlas_real`): where the bore crosses the plate's back face (and a flange's shoulder) its ellipse lies wholly inside the boss's round hole in that face. The exact plane x cylinder trim found no edge crossings and handed the closed section to the sampled restriction, which reads no holes, so it was kept; it split the bore's wall along a curve no face shared, the wall was dropped and the cut fell back. A closed section that crosses none of a plane face's edges, holes included, and whose point lies outside the face's exact outline is now dropped. All 10 pass; replay `20261024-215642`, no regressions against `20261024-181317` (55 timeouts, no column here). Test `crates/operations/tests/bore_just_inside_a_boss.rs` (4 bore seam turns, closed-form volume) |
| 2026-10-25 | 4113 | 86 | 100 | 492 | 0 | 0 | 5100 cases (2218 new: real designs, 1519 "measure" cases that import a body and measure it, 699 booleans; plus 481 from the Mac). Merged upstream 4.2.8 (eleven of the fork's PRs, as upstream reviewed them), no regressions. Two-distance and distance-and-angle chamfers (121 cases, all "unsupported: chamfer type angle" before) now run in brepkit. BuzzCAD (not committed): the bridge's `chamfer_two` takes each edge with a point on the face build123d measures the first length on (the edge's first face in Open CASCADE's edge -> faces map) and picks that face of the edge's two; `engine.chamfer` takes `length2` (angle: `length * tan(angle)`, as build123d does), `operations.py` sends two/angle chamfers to it, and `replay.py` runs them. brepkit: `chamfer::chamfer_two_on` cuts round rims between a cap and a coaxial wall itself (the rim chamfer now takes a cap and a wall distance) and sends other edges to the blend engine's chamfer with a reference face per edge (`ChamferBuilder::add_edges_asymmetric_on`, `blend_ops::chamfer_v2_on`); the blend trimmer keeps a trimmed planar face's holes on the kept side (it dropped them, leaving the hole's wall open), and the original chamfer's asymmetric ends now set each side back by its own face's distance (both took the larger, leaving wedges; its test had locked in the wrong volume). 107 chamfers now pass (109 of the 112 where Open CASCADE succeeds; the 3 left are equal chamfers); replay `20261025-000413`, no regressions against `20261024-224902` (67 timeouts, no column here). Tests `crates/operations/tests/two_distance_chamfers.rs` (a drilled plate's edge from either face, a countersink, closed-form volumes). Next, per the user: the cases with stored reference answers first (the measure cases: 95 mismatch, 25 failed; the 286 referenced booleans) |
| 2026-10-25 | 5352 | 170 | 418 | 1210 | 0 | 0 | 7859 cases; first replay judged against the reference engine's stored answers where good, else Open CASCADE's (replay `20261025-110547`; statuses shift for that reason alone: 191 timeouts and 36 reference_wrong, no columns here). io: a face bounded only by vertex loops on a B-spline surface that closes round one direction and collapses to a pole at each end of the other (a ball or a revolved lemon written as one face) read "ADVANCED_FACE has no bounds"; it now reads as lunes between meridians (the surface sliced where it is only C0, as brepkit's revolve builds a full turn), and an exact B-spline sphere reads as a sphere. All 36 such import failures now import (13 pass); most of the rest leave a few open mesh edges where neighbouring lunes meet, because the B-spline grid mesher meshes each patch on its own quadtree and shared edges need not agree. Test `crates/io/tests/ball_as_one_bspline_face.rs` (a sphere and a spheroid, closed-form volumes, closed mesh). Tried and reverted: (1) the face splitter keeping holes of two arcs (it drops any hole of under three vertices without a closed edge) and routing sections to the internal-loops path only when they close up: no case fixed, 12 regressions (internal loops arrive with gaps over the weld); (2) BuzzCAD cutting a part by several solids in one `compound_cut` (4% faster) gave about 66 silently wrong volumes, so brepkit's `compound_cut` itself is wrong on those (to look into); (3) the face splitter treating a closed B-spline wall as periodic (it treats every B-spline as open, and seams only as lines): changed errors, fixed none. Found: the bored-shell family (`26ffe0466ef2`, `051c7e4abf82`) cut a bore across a lofted wall's seam and onto a two-arc boss-junction hole (causes 1-3 above); 140 measure cases "not closed" because B-spline faces' meshes do not meet flat neighbours' (up to ~850 open edges); on simple shapes brepkit's median time grows ~2.3x per doubling of faces against ~1.5x for Open CASCADE |
| 2026-10-25 | 5427 | 176 | 415 | 1173 | 0 | 0 | 7889 cases (30 new). blend: a chamfer's end is closed by splicing its cross edge into the end face's detour round the corner; the detour may now pass more vertices than the corner (an end face's straight edge left in pieces, the chamfer reaching past the piece at the corner), taking the shortest run between the two contact points (it took only a two-edge run and refused the rest as "trimming failure"). operations: `chamfer_two_on` joins a straight edge's pieces first when two picked edges are collinear pieces sharing a vertex and the same two faces (heal's split-edge join, faces left alone), so a pieced edge takes one chamfer, not one per piece meeting end to end. The 16 new two-distance chamfers of one part (a plate whose end faces' edges are in pieces, the length stepped 10..36) failed; 14 now pass, 3 more give the right solid with fewer faces than Open CASCADE, which keeps the bevel split along the pieces ("faces"). Replay `20261025-153457`, no regressions against `20261025-141855` (the 17 that no longer pass are timeouts under load: 222 timeouts, 11 reference_wrong, no columns here); the join checked by a chamfer-only replay. Tests in `crates/operations/tests/two_distance_chamfers.rs` (a box whose end edges are in pieces, chamfered past a piece and picked piece by piece, closed-form volumes) |
| 2026-10-25 | 11003 | 501 | 926 | 2639 | 1 | 0 | 16003 cases (8136 new from designs replayed step by step, 2156 with the reference engine's own result); replay `20261025-173156`, no regressions against `20261025-153457` (the 10 that no longer pass are timeouts; 290 timeouts, 29 reference_wrong, 68 both_wrong, no columns here). Extrudes of the new designs: 472 came out wrong (the volume formula says so), nearly all with B-spline profile edges. BuzzCAD (not committed): `engine._segments` read an edge as a line when its type name held "LINE", which a BSPLINE's does, so every B-spline profile edge reached brepkit as a straight chord, and brepkit extruded the polygon it was given (in the app too, silently). It now matches the type exactly; and B-spline, Bezier and ellipse profile edges go to brepkit as B-splines over their own span (an ellipse exactly, rational), through a new bridge method `spline(degree, knots, poles, weights)` and a "spline" segment that names the curve. Extrude-only replay: 3794 pass (3429), 22 mismatch (405), 7 failed (248, the "wire is not planar" refusals gone too), 281 faces (side walls of a B-spline edge split differently from the others, both ways), 58 occ_wrong (brepkit right where the volume formula says Open CASCADE is not). Revolve-only: 46 pass (35), 12 mismatch (30), 6 failed (35), 107 faces: brepkit's revolve sweeps a B-spline edge's full turn as sector faces where the others make one (2 that passed only because their nearly straight edges were chords now show as faces); one profile whose revolved B-spline touches the ball round it at one point on the axis fails brepkit's validity check (it read as a polygon before). No brepkit change |
