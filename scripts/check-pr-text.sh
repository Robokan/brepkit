#!/usr/bin/env bash
# Fork-only: before pushing a branch for an upstream pull request, or
# opening / editing one, check that its changed files, commit messages and
# PR text contain none of the names kept private in the corpus
# (buzzcad-corpus/tools/banned_words.txt).  Run it beside the pr-workflow
# skill's banned-name grep.  Prints every hit; exits 1 if there are any, or if
# the private list is missing (a missing list is a failure, never a pass).
#
#   scripts/check-pr-text.sh <branch> [pr-body.md ...]
set -euo pipefail
branch="${1:?usage: scripts/check-pr-text.sh <branch> [pr-body.md ...]}"
shift
here="$(cd "$(dirname "$0")/.." && pwd)"
list="$here/buzzcad-corpus/tools/banned_words.txt"
if [ ! -f "$list" ]; then
  echo "check-pr-text: no word list at $list (git submodule update --init buzzcad-corpus)" >&2
  exit 1
fi
pattern="$(grep -v '^[[:space:]]*\(#\|$\)' "$list" | paste -sd'|' -)"
base="$(git -C "$here" merge-base upstream/main "$branch")"
hits=0
report() { echo "$1"; hits=1; }
while IFS= read -r f; do
  [ -f "$here/$f" ] || continue
  out="$(git -C "$here" diff "$base" "$branch" -- "$f" | grep '^+' | grep -v '^+++' | grep -i -n -E "$pattern" || true)"
  [ -n "$out" ] && report "$f (added lines): $out"
  echo "$f" | grep -q -i -E "$pattern" && report "file name: $f"
done < <(git -C "$here" diff --name-only "$base" "$branch")
out="$(git -C "$here" log --format='%s%n%b' "$base..$branch" | grep -i -n -E "$pattern" || true)"
[ -n "$out" ] && report "commit messages: $out"
for body in "$@"; do
  out="$(grep -i -n -E "$pattern" "$body" || true)"
  [ -n "$out" ] && report "$body: $out"
done
if [ "$hits" -ne 0 ]; then
  echo "check-pr-text: private names found; reword before pushing (see BUZZCAD.md, 'Sending fixes upstream')" >&2
  exit 1
fi
echo "check-pr-text: clean ($branch)"
