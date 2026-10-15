# 012. Automated code review: FileChanged hook wakes a live, project-local subagent

- Status: Accepted
- Date: 2026-10-15

## Context
The user wants every file change reviewed by a subagent against SOLID and SDLC principles, with the subagent living in the project's `.claude/` directory and visible in the session.

Constraints found in the hooks docs:
- `FileChanged` supports only `command`, `http` and `mcp_tool` hooks. It cannot run an `agent` hook, so a hook cannot spawn a subagent by itself.
- A command hook with `async` + `asyncRewake` that exits 2 feeds its stderr to Claude as a system reminder, which wakes the live session.
- The `FileChanged` matcher is a list of literal filenames. Wider coverage needs `watchPaths` returned by a `SessionStart`/`CwdChanged` hook.
- It fires for every writer, including Claude's own edits, and cannot block. A hook that triggers edits can loop.

## Decision
- Subagent: `.claude/agents/code-reviewer.md`, read-only (`Read, Grep, Glob`), sonnet, rubric = SOLID for code plus SDLC checks for all files.
- `.claude/hooks/watch-paths.sh` registers the watch list. `.claude/hooks/review-on-change.sh` applies guards, batches changes after a quiet window, then exits 2 with one review request. Claude delegates to `code-reviewer` in the session and saves reports to `.claude/reviews/`.
- Shared path policy in `.claude/hooks/lib.sh` (one `classify` function used by both scripts).
- Everything lives in the project `.claude/`; nothing is added to `~/.claude`.
- Scope: frontend source, infra config, content and docs, future `backend/`. Excluded: `.env*`, keys, `node_modules`, `dist`, lockfiles, generated JSON, `.claude/**`, and `task.md` (rewritten after every task, so it would be noise and a loop path).
- Guards: content-hash de-dup, 20s quiet-window batching (60s max), 2 reviews per file per hour, 6 wakes per hour, HIGH-only auto-fixes, `.env` read-deny rules in `.claude/settings.json`.
- The earlier idea of a second PostToolUse agent hook was dropped: `FileChanged` already covers Claude's own edits, so it would only duplicate reviews and add latency.

## Alternatives considered
- Detached headless `claude -p` reviewer: works silently in the background, but is not a live in-session subagent and needs extra recursion guards.
- PostToolUse `Edit|Write` agent hook: native subagent, but misses edits by the user or scripts and adds a synchronous delay per edit.
- Wake Claude on every single change: simplest, but floods context; batching fixes that.

## Consequences
- Each batch costs a main-model wake plus sonnet subagent runs. Caps bound the spend. Use `model: haiku` in the agent file to reduce it.
- Files created after session start are not watched until the next `SessionStart`/`CwdChanged`.
- Hooks load after `/hooks` or a restart; the new subagent loads after `/agents` or a restart.
- The reviewer sees whole files, not diffs, because the repo has no commits yet.
- To disable: remove the `FileChanged` entry from `.claude/settings.json`, or set `"disableAllHooks": true`.

## Verification record (2026-10-15)
- Pipe tests (`bash` 3.2): 31 checks passed, covering path exclusions, unlink, content-hash de-dup, 3-event batching into one request with one leader, per-file budget, hourly cap, docs-only spacing, and exit code 2 with stderr-only output.
- `watchPaths` shape: verified with `claude -p --debug-file`. Only `hookSpecificOutput.watchPaths` is read, for both `SessionStart` and `CwdChanged`; a top-level `watchPaths` is logged as an unrecognized key and ignored. The log shows `FileChanged: watching 48 paths`.
- Subagent quality: on a probe file with a hard-coded key, a component bypassing `src/api/`, an XSS sink and an SRP/ISP/OCP mix, the reviewer returned HIGH findings for the secret (without repeating it), both DIP breaks and the XSS sink, plus MED SRP/ISP/OCP, with correct line numbers, and edited nothing.
- End to end (headless): Claude edited a watched file with Bash -> `FileChanged` fired -> the hook queued, waited the quiet window and exited 2 -> Claude woke, delegated to `code-reviewer` (3 turns, ~14s), saved the report to `.claude/reviews/`, fixed nothing (no HIGH) -> exactly one wake, no loop. The test edit was reverted and the tree matched a pre-test snapshot.
- Still to observe in the interactive session: the notification wording for an exit-2 wake (the debug log labels it an "error", which is the documented asyncRewake behaviour) and how directories behave in `watchPaths`.
- A side effect worth noting: the first real review found a genuine bug, `timeAgo()` in `frontend/src/lib/utils.ts` returns "NaNy ago" for a malformed date.

