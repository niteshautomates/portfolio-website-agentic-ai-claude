# Task Tracker

Status: `[ ]` todo, `[~]` in progress, `[x]` done. Decisions live in `decisions/` (see `decisions/README.md`).

## Current focus
Review automation built and verified headlessly (ADR-012). Needs a `/hooks` + `/agents` reload (or restart) in the interactive session. Phase 1.5 UI review and Phase 2 (backend) still pending the user.

## Next up
1. User: replace TODOs in `content/profile.yaml` (bio, experience summary, optional `yearsExperience`), rotate the ngrok + GitHub tokens that were exposed.
2. Optional: finish UI-11 (reduced-motion + tablet check).
3. Then P2-01 FastAPI skeleton.

## Phase 0: Setup and tracking
- [x] P0-01 `git init`, folder skeleton
- [x] P0-02 `decisions/` with index, template, ADR 001-004
- [x] P0-03 `task.md`
- [x] P0-04 `.gitignore`, `.env.example`, `README.md` skeleton

## Phase 1: Static portfolio (no backend)
- [x] P1-01 Scaffold Vite + React + TS in `frontend/` (ADR-001)
- [x] P1-02 `src/api/projects.ts` data layer reading static JSON (ADR-001, ADR-003)
- [x] P1-03 `scripts/fetch-github.ts` plus `content/projects.yaml` (ADR-002)
- [x] P1-04 Pages and components: Hero/About, Projects grid with filters, Skills, Contact links
- [x] P1-05 Responsive layout, dark/light mode
- [x] P1-06 `docker/frontend.Dockerfile` (multi-stage, nginx:alpine)
- [x] P1-07 `nginx/default.conf` (SPA fallback, gzip, caching, security headers, commented `/api/` proxy)
- [x] P1-08 `docker-compose.yml` with `web` and `ngrok` (ADR-004)
- [x] P1-09 README run instructions
- [x] P1-10a Verify locally: build, lint, `docker compose up web`, 200 on `/`, SPA fallback on `/projects`, gzip, cache and security headers, 404 on missing asset, screenshot reviewed
- [ ] P1-10b Verify ngrok tunnel from another network (blocked on authtoken)
- [ ] P1-11 User content: real bio, LinkedIn, public email, confirm featured shortlist

## Phase 1.5: UI redesign (ADR-008 to 011)
- [x] UI-01 Secrets cleanup: `.env.example` blanked (user to rotate ngrok + GitHub tokens that were exposed)
- [x] UI-02 Tailwind v4 + shadcn-style primitives + motion setup, tokens, fonts
- [x] UI-03 Layout shell + Header (mobile menu, active section, theme toggle)
- [x] UI-04 Hero + animated Terminal
- [x] UI-05 Stats + Tech marquee
- [x] UI-06 Projects redesign (spotlight, search, filters, card effects)
- [x] UI-07 Experience timeline
- [x] UI-08 Skills + Contact
- [x] UI-09 Extend profile.yaml/types, re-run fetch
- [x] UI-10 Favicon + meta/OG tags
- [~] UI-11 Responsive, a11y, reduced-motion pass (done: 1280 and 390px, dark+light, no horizontal overflow, keyboard-focusable controls, aria labels; reduced-motion is implemented in code but not yet checked with emulation; 768px tablet not screenshotted)
- [x] UI-12 Rebuild image and verify: build+lint clean, 151 kB gzip JS, console clean (after CSP font-src fix), filter/search/theme/mobile-menu exercised, ngrok tunnel still up
- [~] UI-13 Phone number in Contact: code done and verified (button hidden when empty, dummy number rendered correctly on desktop and mobile, then removed). Waiting for the user to fill `links.phone` in `content/profile.yaml`, then `npm run fetch:github` and `docker compose up -d --build --force-recreate web`.

## Review automation (ADR-012)
- [x] RV-01 ADR-012 and this block
- [x] RV-02 `.claude/agents/code-reviewer.md` (read-only subagent, SOLID + SDLC rubric)
- [x] RV-03 `.claude/hooks/lib.sh` path policy + `watch-paths.sh`
- [x] RV-04 `.claude/hooks/review-on-change.sh` (guards, batching, budgets)
- [x] RV-05 `.claude/settings.json` (hooks + `.env` read-deny), `.gitignore`
- [x] RV-06 Pipe tests for both scripts
- [x] RV-07 Subagent quality test on a probe file
- [~] RV-08 README section done; remaining user step: open `/hooks` (or restart) and `/agents` so this interactive session loads the new hooks and subagent. Headless end-to-end already passed (see ADR-012 verification).

## Phase 2: Backend and database
- [ ] P2-01 FastAPI skeleton in `backend/` with `/api/health`
- [ ] P2-02 Postgres service and Alembic migrations (compose profile)
- [ ] P2-03 `/api/projects` DB-backed
- [ ] P2-04 `/api/contact` with validation and rate limiting
- [ ] P2-05 nginx `/api/` proxy enabled; frontend `src/api/` switched to the API

## Phase 3: Content and sync
- [ ] P3-01 Blog: posts table, API, list/detail pages
- [ ] P3-02 Scheduled GitHub sync job into the DB

## Phase 4: Admin and analytics
- [ ] P4-01 Admin authentication
- [ ] P4-02 Admin UI for projects, blog posts, contact messages
- [ ] P4-03 Page-view tracking endpoint and dashboard

## Phase 5: Hardening
- [ ] P5-01 CI (lint, build, image scan)
- [ ] P5-02 Postgres backups
- [ ] P5-03 Healthchecks and logging for all services
- [ ] P5-04 Reserved ngrok domain (optional)
