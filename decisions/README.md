# Decision Log

Every non-trivial choice for this project is recorded here, one file per decision, so any session can restore context quickly.

**Restoring context:** read this index, then `../task.md` ("Current focus" and the current phase). Open individual ADRs only when a task links to them.

**Rules**
- Write the ADR *before* the code that depends on it.
- Never edit an accepted decision's substance. Add a new ADR that supersedes it and mark the old one `Superseded by NNN`.
- File name: `NNN-kebab-title.md`, numbers are sequential.

## Index

| # | Title | Status | Date |
|---|-------|--------|------|
| [001](001-frontend-vite-react-ts.md) | Frontend: Vite + React + TypeScript | Accepted | 2026-10-15 |
| [002](002-project-data-build-time-fetch-plus-yaml.md) | Project data: build-time GitHub fetch + curated YAML | Accepted | 2026-10-15 |
| [003](003-phased-roadmap.md) | Phased roadmap (static first, backend later) | Accepted | 2026-10-15 |
| [004](004-docker-compose-nginx-ngrok-fastapi-postgres.md) | Infra: docker compose, nginx, ngrok container; FastAPI + Postgres later | Accepted | 2026-10-15 |
| [005](005-single-page-sections-plain-css.md) | Single-page sections, plain CSS, no router | Partly superseded by 008 | 2026-10-15 |
| [006](006-generated-data-committed.md) | Generated data files committed; Docker build needs no GitHub access | Accepted | 2026-10-15 |
| [007](007-nginx-and-container-hardening.md) | nginx and container defaults | Accepted | 2026-10-15 |
| [008](008-tailwind-shadcn-motion.md) | UI stack: Tailwind v4 + shadcn-style components + Motion | Accepted | 2026-10-15 |
| [009](009-dark-techy-design-system.md) | Dark-first techy design system and motion rules | Accepted | 2026-10-15 |
| [010](010-self-hosted-fonts-and-icons.md) | Self-hosted fonts and bundled icons | Accepted | 2026-10-15 |
| [011](011-profile-content-no-invented-data.md) | Profile content from profile.yaml; nothing invented | Accepted | 2026-10-15 |
| [012](012-automated-code-review-hooks.md) | Automated code review: FileChanged hook wakes a live, project-local subagent | Accepted | 2026-10-15 |
| [013](013-github-mcp-server.md) | GitHub MCP server, project-scoped, token from the environment | Accepted | 2026-10-15 |

## Template

```markdown
# NNN. Title

- Status: Proposed | Accepted | Superseded by NNN
- Date: YYYY-MM-DD

## Context
Why a decision is needed.

## Decision
What we chose.

## Alternatives considered
- Option: why not.

## Consequences
What this makes easier or harder, and which phase it affects.
```
