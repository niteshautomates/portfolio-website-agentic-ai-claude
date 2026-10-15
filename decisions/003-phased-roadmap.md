# 003. Phased roadmap (static first, backend later)

- Status: Accepted
- Date: 2026-10-15

## Context
No backend is needed now, but the user wants one later with database connections. The code and infra must be structured so adding it is additive.

## Decision
- Phase 0: setup and tracking
- Phase 1: static portfolio (nginx + ngrok, no backend)
- Phase 2: FastAPI + Postgres, contact form, DB-backed projects
- Phase 3: blog and scheduled GitHub sync job
- Phase 4: admin panel and visitor analytics
- Phase 5: hardening (CI, backups, healthchecks)

Phase 1 leaves explicit seams: the `src/api/` layer, a commented `/api/` proxy block in nginx, an empty `backend/` folder, and compose profiles for future services.

## Alternatives considered
- Build the full stack up front: slower to a visible result and more to maintain while unused.
- Static only with no planned seams: cheaper now, but later phases would force a restructure.

## Consequences
- Each phase should leave the site working and deployable.
- Scope for a phase is whatever `task.md` lists under it, nothing from later phases.
