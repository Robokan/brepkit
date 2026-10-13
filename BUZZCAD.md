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

## Progress

Baseline: 2026-10-13, brepkit 4.1.49, 309 cases from BuzzCAD's example and
library files.

| date | pass | faces | mismatch | failed | crash | unsupported | what changed |
|---|---|---|---|---|---|---|---|
| 2026-10-13 | 170 | 33 | 0 | 24 | 0 | 82 | baseline: 21 mesh-fallback booleans, 2 STEP "empty wire" imports, 1 inconsistent orientation; the 82 unsupported are multi-solid inputs (bridge) |
