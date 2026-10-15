# 013. GitHub MCP server, project-scoped, token from the environment

- Status: Accepted
- Date: 2026-10-15

## Context
Git operations on GitHub (branches, pull requests, issues) are requested from Claude Code during this project. A GitHub MCP server gives Claude those as tools, and the config must be shared with the repo without leaking a credential. Real tokens have already leaked into `.env.example` once, so the config must never hold a literal secret.

## Decision
- Config lives in the project root `.mcp.json`, so it applies to this repo only and is committed.
- One server, `github`, type `http`, URL `https://api.githubcopilot.com/mcp/`.
- Auth is the `Authorization` header set to a `Bearer` value that references `${GITHUB_TOKEN}`. The token is read from the shell environment at launch and is never written to a committed file.
- The real value stays outside the repo (shell environment or the git-ignored `.env`). Committed templates must hold no value. Claude does not read `.env*` files (`.claude/settings.json` deny rules).
- Token scope: a fine-grained personal access token limited to this repository, with Contents and Pull requests read/write. Nothing broader.

## Alternatives considered
- Local `npx`/Docker MCP server process: no hosted dependency, but needs Node or Docker running per session and a second place to manage the token.
- `gh` CLI only: no MCP needed and already works for PRs, but the user asked for MCP-based GitHub operations.
- Put the config in user-level `~/.claude`: shared across all repos, which is broader than needed and not reproducible from the repo.

## Consequences
- Anyone cloning the repo gets the server definition and only needs to export `GITHUB_TOKEN` before starting Claude Code.
- If `GITHUB_TOKEN` is unset the server fails to authenticate; the rest of the project is unaffected.
- The token grants write access to the repo, so it must be rotated if it ever appears in a file, log or chat.
- Doesn't affect any delivery phase; tooling only.
