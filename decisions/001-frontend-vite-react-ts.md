# 001. Frontend: Vite + React + TypeScript

- Status: Accepted
- Date: 2026-10-15

## Context
Phase 1 is a static site served by nginx. Later phases add a backend API, a blog and an admin panel, so the frontend must grow into an app that calls an API without a rewrite.

## Decision
Vite + React + TypeScript, built to static files. All data access goes through a thin `src/api/` layer. In Phase 1 it reads static JSON, and in Phase 2 it calls `/api/*`.

## Alternatives considered
- Astro: great for static content, but fewer patterns for the admin panel and API-driven pages in later phases.
- Plain HTML/CSS/JS: no build step, but becomes hard to maintain once the admin and blog arrive.
- Next.js: static export fights its strengths, and it is heavier than Phase 1 needs.

## Consequences
- Needs a Node build stage in the Dockerfile (multi-stage, so the final image is only nginx + static files).
- Components never fetch data directly, only through `src/api/`.
