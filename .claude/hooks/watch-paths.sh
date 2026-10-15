#!/bin/bash
# SessionStart / CwdChanged hook (decisions/012).
# FileChanged only watches literal filenames, so list every reviewable file as an absolute path.
# Files created after this runs are picked up on the next SessionStart / CwdChanged.
# Output shape verified with `claude -p --debug-file`: ONLY hookSpecificOutput.watchPaths is read,
# for both events; a top-level watchPaths is reported as an "unrecognized key (ignored)".
ROOT="${CLAUDE_PROJECT_DIR:-$PWD}"
# shellcheck source=lib.sh
. "$ROOT/.claude/hooks/lib.sh"
cd "$ROOT" || exit 0

event="SessionStart"
if [ ! -t 0 ]; then
  event=$(jq -r '.hook_event_name // "SessionStart"' 2>/dev/null || echo SessionStart)
  [ -n "$event" ] || event="SessionStart"
fi

{
  find frontend backend nginx docker content decisions \
    \( -name node_modules -o -name dist -o -name .venv -o -name __pycache__ \) -prune -o -type f -print 2>/dev/null
  ls docker-compose.yml README.md 2>/dev/null
} | while IFS= read -r f; do
  f="${f#./}"
  [ "$(classify "$f")" != skip ] && printf '%s\n' "$ROOT/$f"
done | sort -u | jq -R . | jq -s -c --arg ev "$event" \
  '{hookSpecificOutput: {hookEventName: $ev, watchPaths: .}}'
