#!/bin/bash
# FileChanged hook (decisions/012). Registered async + asyncRewake.
#
# A hook cannot start a subagent itself, so this script decides WHETHER a review is worthwhile and,
# if so, exits 2 with one batched request on stderr. asyncRewake feeds that text to Claude in the
# live session, which then delegates to the project's `code-reviewer` subagent.
#
# Guards (each exists to stop a review -> fix -> review loop or runaway cost):
#   path policy (lib.sh) -> content-hash de-dup -> quiet-window batching (one leader via mkdir)
#   -> per-file budget -> hourly wake cap -> docs-only spacing.
#
# Test knobs: REVIEW_DRY_RUN=1 (print to stdout, exit 0), REVIEW_STATE_DIR, REVIEW_QUIET_SECS,
#             REVIEW_MAX_WAIT_SECS, REVIEW_FILE_BUDGET, REVIEW_HOURLY_CAP, REVIEW_DOCS_GAP_SECS.
# Written for bash 3.2 (macOS default).
set -u

ROOT="${CLAUDE_PROJECT_DIR:-$PWD}"
# shellcheck source=lib.sh
. "$ROOT/.claude/hooks/lib.sh"

STATE="${REVIEW_STATE_DIR:-$ROOT/.claude/reviews/.state}"
QUIET="${REVIEW_QUIET_SECS:-20}"
MAXWAIT="${REVIEW_MAX_WAIT_SECS:-60}"
FILE_BUDGET="${REVIEW_FILE_BUDGET:-2}"      # reviews per file per rolling hour
HOUR_CAP="${REVIEW_HOURLY_CAP:-6}"          # wakes per rolling hour
DOCS_GAP="${REVIEW_DOCS_GAP_SECS:-300}"     # min seconds between docs-only wakes
DRY_RUN="${REVIEW_DRY_RUN:-0}"
LOCK="$STATE/leader.lock"
mkdir -p "$STATE/queue"

now() { date +%s; }
sha_of() { shasum -a 256 "$1" | cut -d' ' -f1; }
key_of() { printf '%s' "$1" | shasum | cut -c1-16; }
log_skip() { printf '%s %s\n' "$(date '+%F %T')" "$*" >> "$STATE/skipped.log"; }
# count_recent <log file of epoch lines> <window secs>
count_recent() {
  [ -f "$1" ] || { echo 0; return; }
  awk -v c="$(( $(now) - $2 ))" '$1 >= c { n++ } END { print n + 0 }' "$1"
}

# ---------------------------------------------------------------- 1. enqueue
input=$(cat)
file=$(printf '%s' "$input" | jq -r '.file_path // empty' 2>/dev/null)
event=$(printf '%s' "$input" | jq -r '.event // "change"' 2>/dev/null)
[ -n "$file" ] || exit 0
[ "$event" = "unlink" ] && exit 0
[ -f "$file" ] || exit 0

rel="${file#"$ROOT"/}"
class=$(classify "$rel")
[ "$class" = "skip" ] && exit 0

key=$(key_of "$rel")
hash=$(sha_of "$file")
if [ -f "$STATE/hash-$key" ] && [ "$(cat "$STATE/hash-$key")" = "$hash" ]; then
  exit 0   # content already reviewed (also swallows touch-only and revert-to-reviewed events)
fi
# One queue file per source file: later changes overwrite earlier ones, so a burst is one entry.
printf '%s\t%s\t%s\n' "$rel" "$hash" "$class" > "$STATE/queue/$key"

# ---------------------------------------------------------------- 2. leader election
acquire() {
  mkdir "$LOCK" 2>/dev/null && return 0
  local age=$(( $(now) - $(mtime "$LOCK") ))
  if [ "$age" -gt $(( MAXWAIT + 60 )) ]; then   # leader died without cleanup
    rm -rf "$LOCK"
    mkdir "$LOCK" 2>/dev/null && return 0
  fi
  return 1
}
acquire || exit 0   # another invocation is the leader and will pick this entry up
trap 'rmdir "$LOCK" 2>/dev/null' EXIT

# ---------------------------------------------------------------- 3. quiet window
start=$(now)
while :; do
  newest=0
  for q in "$STATE"/queue/*; do
    [ -f "$q" ] || continue
    m=$(mtime "$q"); [ "$m" -gt "$newest" ] && newest="$m"
  done
  t=$(now)
  [ $(( t - newest )) -ge "$QUIET" ] && break
  [ $(( t - start )) -ge "$MAXWAIT" ] && break
  sleep 1
done

# ---------------------------------------------------------------- 4. drain
BATCH="$STATE/batch.$$"
: > "$BATCH"
drain() {
  local q rel hash class k f cur
  for q in "$STATE"/queue/*; do
    [ -f "$q" ] || continue
    IFS=$'\t' read -r rel hash class < "$q"
    rm -f "$q"
    f="$ROOT/$rel"; [ -f "$f" ] || continue
    k=$(key_of "$rel"); cur=$(sha_of "$f")
    if [ -f "$STATE/hash-$k" ] && [ "$(cat "$STATE/hash-$k")" = "$cur" ]; then continue; fi
    if [ "$(count_recent "$STATE/budget-$k" 3600)" -ge "$FILE_BUDGET" ]; then
      log_skip "per-file budget reached: $rel"; continue
    fi
    printf '%s\t%s\t%s\t%s\n' "$rel" "$cur" "$k" "$class" >> "$BATCH"
  done
}
drain
drain   # second pass shrinks the window in which a late entry could be orphaned

[ -s "$BATCH" ] || { rm -f "$BATCH"; exit 0; }

# ---------------------------------------------------------------- 5. global gates
files=$(wc -l < "$BATCH" | tr -d ' ')
if [ "$(count_recent "$STATE/wakes.log" 3600)" -ge "$HOUR_CAP" ]; then
  log_skip "hourly wake cap ($HOUR_CAP) reached; dropped $files file(s)"; rm -f "$BATCH"; exit 0
fi
if ! awk -F'\t' '$4 != "docs" { found = 1 } END { exit !found }' "$BATCH"; then   # docs-only batch
  last=$(tail -1 "$STATE/wakes.log" 2>/dev/null || echo 0)
  if [ $(( $(now) - ${last:-0} )) -lt "$DOCS_GAP" ]; then
    log_skip "docs-only batch within ${DOCS_GAP}s of last wake; dropped $files file(s)"; rm -f "$BATCH"; exit 0
  fi
fi

# ---------------------------------------------------------------- 6. record + emit
t=$(now)
while IFS=$'\t' read -r rel cur k class; do
  printf '%s' "$cur" > "$STATE/hash-$k"
  echo "$t" >> "$STATE/budget-$k"
done < "$BATCH"
echo "$t" >> "$STATE/wakes.log"

emit() {
  echo "CODE REVIEW REQUEST (automated by the FileChanged hook, decisions/012)"
  echo "These files changed and need a SOLID + SDLC review:"
  while IFS=$'\t' read -r rel cur k class; do echo "- $rel [$class]"; done < "$BATCH"
  cat <<'EOF'

Do this now:
1. Delegate each file to the `code-reviewer` subagent (Agent tool, subagent_type "code-reviewer"), giving it the file path and class. Run independent reviews in parallel.
2. Save each report verbatim to .claude/reviews/<YYYYMMDD-HHMMSS>-<file-slug>.md (that folder is never reviewed).
3. Reply with a short summary: verdict and HIGH/MED/LOW counts per file.
4. Fix only HIGH-severity findings, with the smallest possible edit. Leave MED/LOW for the user.
5. Do NOT ask for another review after fixing. A hook may queue at most one re-check per file per hour on its own.
6. If you are in the middle of the user's task, finish the current step first, then do the review.
EOF
}

rm -f "$BATCH.out"
if [ "$DRY_RUN" = "1" ]; then
  emit; rm -f "$BATCH"; exit 0
fi
emit >&2
rm -f "$BATCH"
exit 2
