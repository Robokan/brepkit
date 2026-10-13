#!/usr/bin/env bash
# Copy BuzzCAD's brepkit corpus and its replay results into the
# buzzcad-corpus/ submodule (the private Robokan/buzzcad-corpus repo), commit
# and push them, so every machine that runs BuzzCAD adds its recordings to one
# regression set (see BUZZCAD.md).
#
#   ./scripts/sync-buzzcad-corpus.sh [--no-push] [corpus dir]
#
# Pulls first, so this checkout also gets the other machines' recordings.
#
# The corpus is found at the argument, else $BUZZCAD_CORPUS_DIR, else
# BuzzCAD's default ~/Library/Logs/BuzzCAD/brepkit-corpus. A machine without
# one is not an error: the script says so and does nothing.
#
# Only adds and updates, never deletes: cases and shapes are named by content
# hash, so recordings from several machines merge without clashing. For every
# replay it copies report.md,
# results.jsonl and worker.log. The failures/ export (STEP files for each
# failing case) is kept for the newest replay only: older ones are
# reproducible from cases/ and shapes/, and each is ~10 MB.
#
# Reads the corpus; never writes to it.
set -euo pipefail

PUSH=1
if [ "${1:-}" = "--no-push" ]; then
  PUSH=0
  shift
fi
SRC="${1:-${BUZZCAD_CORPUS_DIR:-$HOME/Library/Logs/BuzzCAD/brepkit-corpus}}"
DEST="$(cd "$(dirname "$0")/.." && pwd)/buzzcad-corpus"

if [ ! -d "$SRC/cases" ]; then
  echo "no BuzzCAD corpus at $SRC: nothing to sync"
  exit 0
fi
if [ ! -e "$DEST/.git" ]; then
  git -C "$DEST/.." submodule update --init buzzcad-corpus
fi
git -C "$DEST" checkout -q main
git -C "$DEST" pull -q --rebase
mkdir -p "$DEST/cases" "$DEST/shapes" "$DEST/replays"

rsync -a "$SRC/cases/" "$DEST/cases/"
rsync -a "$SRC/shapes/" "$DEST/shapes/"

newest=""
for dir in "$SRC"/replays/*/; do
  [ -d "$dir" ] || continue
  name="$(basename "$dir")"
  mkdir -p "$DEST/replays/$name"
  for f in report.md results.jsonl worker.log; do
    [ -f "$dir/$f" ] && cp "$dir/$f" "$DEST/replays/$name/$f"
  done
  newest="$name"
done

# failures/ for the newest replay only (deletes only inside this repo's copy)
for dir in "$DEST"/replays/*/; do
  [ -d "$dir" ] || continue
  [ "$(basename "$dir")" = "$newest" ] || rm -rf "$dir/failures"
done
if [ -n "$newest" ] && [ -d "$SRC/replays/$newest/failures" ]; then
  rsync -a --delete "$SRC/replays/$newest/failures/" "$DEST/replays/$newest/failures/"
fi

git -C "$DEST" add -A
if git -C "$DEST" diff --cached --quiet; then
  echo "buzzcad-corpus already has everything in $SRC"
  exit 0
fi
cases="$(git -C "$DEST" diff --cached --name-only --diff-filter=A -- cases | wc -l | tr -d ' ')"
git -C "$DEST" commit -q -m "Sync from $(hostname -s): $cases new case(s), newest replay ${newest:-none}"
if [ "$PUSH" = 1 ]; then
  git -C "$DEST" push -q
fi
echo "synced $SRC -> $DEST: $cases new case(s), newest replay ${newest:-none}"
