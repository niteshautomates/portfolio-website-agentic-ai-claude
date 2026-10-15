# Portfolio Website

Personal portfolio showcasing projects from https://github.com/niteshautomates.
Served by nginx in Docker and exposed publicly through ngrok. Built in phases: static site first, backend and database later.

## Project tracking
- [`task.md`](task.md): what is done, in progress and next
- [`decisions/`](decisions/README.md): every design decision, one file each

## Stack
Vite + React + TypeScript, Tailwind CSS v4, shadcn-style components, Motion, nginx, docker compose, ngrok. FastAPI + Postgres from Phase 2.

## Run
```bash
cp .env.example .env      # add NGROK_AUTHTOKEN
docker compose up --build
```
- Local: http://localhost:8080
- Public URL: `docker compose logs ngrok` (look for `url=https://…ngrok…`), or open the inspector at http://localhost:4040
- Without a token, run only the site: `docker compose up --build web`

## Updating content
| What | Edit | Then |
|------|------|------|
| Bio, skills, links, terminal lines, experience | `content/profile.yaml` | `cd frontend && npm run fetch:github` |
| Featured projects, titles, summaries | `content/projects.yaml` | same |
| New repos on GitHub | nothing | same (set `GITHUB_TOKEN` to avoid rate limits) |

Then rebuild: `docker compose up -d --build --force-recreate web` (plain `up --build -d` may leave the old container running). The fetch step writes `frontend/src/data/*.json`, which are committed (see decisions/006).

## Frontend development
```bash
cd frontend
npm install
npm run dev        # http://localhost:5173
npm run build && npm run lint
```

## Secrets
`.env` holds real values and is git-ignored. `.env.example` is committed and must stay free of real values.

## GitHub MCP server (decisions/013)
`.mcp.json` registers the `github` MCP server (`https://api.githubcopilot.com/mcp/`) for this repo. It reads `GITHUB_TOKEN` from your shell environment, so export it before starting Claude Code. Use a fine-grained token limited to this repo (Contents and Pull requests: read/write). Never put the token in `.mcp.json` or `.env.example`.

## Review automation (decisions/012)
A `FileChanged` hook watches source, infra and docs files. When files change it waits for a 20s quiet window, then wakes Claude with one batched request, and Claude runs the read-only `code-reviewer` subagent (`.claude/agents/code-reviewer.md`) against SOLID and SDLC checks. Reports are saved to `.claude/reviews/` (git-ignored). Only HIGH findings are auto-fixed.

- Files: `.claude/settings.json`, `.claude/hooks/{lib,watch-paths,review-on-change}.sh`, `.claude/agents/code-reviewer.md`.
- Load it in a running session with `/hooks` and `/agents` (or restart Claude Code).
- Limits: 2 reviews per file and 6 wakes per hour; `.env*`, generated data, lockfiles, `task.md` and `.claude/` are never reviewed. See `.claude/reviews/.state/skipped.log` for what was dropped.
- Cheaper: set `model: haiku` in the agent file. Off: delete the `FileChanged` entry in `.claude/settings.json` or set `"disableAllHooks": true`.
- Files created mid-session are watched after the next session start or directory change.

