# 004. Infra: docker compose, nginx, ngrok container; FastAPI + Postgres later

- Status: Accepted
- Date: 2026-10-15

## Context
The site must run in Docker with nginx serving the pages and be reachable publicly through ngrok. Neither nginx nor ngrok is installed on the host, only Docker. A Python backend fits the user's Python/AI background.

## Decision
- `docker compose` is the single entry point (`docker compose up --build`).
- Services: `web` (multi-stage image, nginx:alpine serving the Vite build) and `ngrok` (official `ngrok/ngrok` image, tunnelling to `web:80`, authtoken from `.env`).
- Phase 2 adds `api` (FastAPI) and `db` (Postgres) under a compose profile. nginx proxies `/api/` to `api:8000`.
- Secrets live in `.env` (git-ignored), with a committed `.env.example`.

## Alternatives considered
- ngrok on the host: needs a local install and is not reproducible.
- Node/Express or Spring Boot backend: workable, but FastAPI is lighter and matches the user's Python skills.

## Consequences
- The whole stack is reproducible from the repo plus a `.env`.
- The free ngrok URL changes on restart unless a reserved domain is configured (`NGROK_DOMAIN`, Phase 5).
