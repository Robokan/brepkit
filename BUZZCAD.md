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

3. **Pick the commonest real problem and reproduce it here in Rust.** Each
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
| pass | same solid as Open CASCADE (volume, area and bounding box within 0.1%, same face count) | nothing |
| faces | same solid, but a different face count. Usually brepkit leaves faces split that should be merged, or adds slivers. | fix it, lower priority |
| mismatch | a different solid. The judge says brepkit is wrong, or nothing independent could decide. | fix it. With judge "unknown", work out by geometry which one is right first |
| failed | brepkit errored, or BuzzCAD's checks rejected its result. The reason says which. | fix it |
| crash / timeout | brepkit panicked, segfaulted or hung. `worker.log` has the output. | fix it, high priority |
| occ_wrong | they differ, and Open CASCADE's result is the wrong one | **do not change brepkit to match it.** Note it for the user |
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

- **Open CASCADE is the reference, not the truth.** It has bugs too. Never
  make brepkit match Open CASCADE just because it is Open CASCADE. When the
  results differ, `replay.py` runs a judge that uses neither kernel's
  result:
  - booleans: sample points classified against the inputs;
  - extrude and revolve: their volume formulas;
  - all results: a validity check.

  The verdict is in `results.jsonl` under `"judge"`. If the judge can't
  decide, reason about the geometry (`occ.step` against your result) before
  you "fix" anything.
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

**In flight (2026-10-13).** Seven PR branches are pushed to `origin`
(Robokan/brepkit), each `upstream/main` plus one fix. Their PR descriptions
are in `buzzcad-prs/`. No PR is open yet.

| branch | body | status |
|---|---|---|
| fix/shell-orientation-holes | shell.md | tested; open first |
| fix/step-outer-loop-by-area | outer.md | not tested yet |
| fix/step-vertex-loop-sphere | sphere.md | not tested yet |
| fix/step-planes-facing-out | planes.md | not tested yet; stacked on shell-orientation-holes |
| fix/cylinder-wall-rim-notches | notch.md | tested |
| fix/plane-cylinder-line-outside-face | line.md | tested |
| fix/ring-face-sample | ring.md | tested |

"Tested" means clippy clean and `cargo test -p brepkit-algo -p
brepkit-operations --lib` passing (1197 tests) on that branch alone. The
fork's `main`, with all seven fixes together, passed the full io, algo and
operations suites (2084 tests).

Next:

1. Set up (once per machine):

   ```bash
   git remote add upstream https://github.com/andymai/brepkit.git
   git fetch upstream origin
   git worktree add .worktrees/upstream-prs fix/shell-orientation-holes
   ```

2. In `.worktrees/upstream-prs`, for each untested io branch:
   `git switch <branch>`, `cargo clippy -p brepkit-io --all-targets -- -D warnings`,
   `cargo test -p brepkit-io`.
3. For the four algo branches, run the pose sweep and truth audit (see the
   `pr-workflow` skill) on `upstream/main` and on the branch, and account for
   any line that changes.
4. Open each PR, shell-orientation-holes first, from this checkout's root
   (the PR bodies live on the fork's `main`, not on the PR branches):
   `gh pr create --repo andymai/brepkit --head Robokan:<branch> --title "<commit subject>" --body-file buzzcad-prs/<body>`.
   Do not set auto-merge; merging is the maintainer's call. Record the PR
   numbers here.

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
