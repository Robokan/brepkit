#!/usr/bin/env bash
# Fork-only: keep the names that must never be public out of every commit on
# this fork, main included. Run by the fork's .husky/pre-commit (staged
# changes) and .husky/commit-msg (the message). The names are the entries
# above the "upstream pull requests only" marker in the private list
# buzzcad-corpus/tools/banned_words.txt (scripts/check-pr-text.sh reads the
# whole list for upstream pull requests). A missing list is a failure, never
# a pass.
#
#   scripts/check-commit-words.sh --staged
#   scripts/check-commit-words.sh --message <commit-message-file>
set -euo pipefail
here="$(cd "$(dirname "$0")/.." && pwd)"
list="$here/buzzcad-corpus/tools/banned_words.txt"
if [ ! -f "$list" ]; then
  echo "check-commit-words: no word list at $list (git submodule update --init buzzcad-corpus)" >&2
  exit 1
fi
pattern="$(sed '/^# --- upstream pull requests only ---/q' "$list" \
  | grep -v '^[[:space:]]*\(#\|$\)' | paste -sd'|' -)"
if [ -z "$pattern" ]; then
  echo "check-commit-words: the word list has no entries above its marker" >&2
  exit 1
fi
hits=0
case "${1:-}" in
  --staged)
    # Lines the commit adds, and the paths it adds or renames to. The
    # corpus submodule's own commits are checked by its own repository.
    out="$(git -C "$here" diff --cached --no-color --unified=0 -- . ':(exclude)buzzcad-corpus' \
      | grep '^+' | grep -v '^+++' | grep -i -n -E "$pattern" || true)"
    if [ -n "$out" ]; then
      echo "check-commit-words: staged lines name what must stay private:" >&2
      echo "$out" | cut -c1-200 >&2
      hits=1
    fi
    names="$(git -C "$here" diff --cached --name-only --diff-filter=ACR | grep -i -E "$pattern" || true)"
    if [ -n "$names" ]; then
      echo "check-commit-words: staged file names: $names" >&2
      hits=1
    fi
    ;;
  --message)
    msg="${2:?usage: scripts/check-commit-words.sh --message <file>}"
    out="$(grep -v '^#' "$msg" | grep -i -n -E "$pattern" || true)"
    if [ -n "$out" ]; then
      echo "check-commit-words: the commit message names what must stay private:" >&2
      echo "$out" | cut -c1-200 >&2
      hits=1
    fi
    ;;
  *)
    echo "usage: scripts/check-commit-words.sh --staged | --message <file>" >&2
    exit 2
    ;;
esac
if [ "$hits" -ne 0 ]; then
  echo "check-commit-words: reword (see the engine naming in BUZZCAD.md)" >&2
  exit 1
fi
