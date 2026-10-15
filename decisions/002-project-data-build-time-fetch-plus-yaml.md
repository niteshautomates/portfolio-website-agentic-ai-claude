# 002. Project data: build-time GitHub fetch + curated YAML

- Status: Accepted
- Date: 2026-10-15

## Context
GitHub account `niteshautomates` has 50 public repos, many of them forks, tutorials or exercises. Showing all of them would dilute the portfolio, and live browser calls to the GitHub API hit rate limits.

## Decision
A script (`frontend/scripts/fetch-github.ts`) fetches repo metadata from the GitHub REST API at build time (optional `GITHUB_TOKEN`), excludes forks by default, and merges it with `content/projects.yaml`. The YAML holds the featured list, titles, summaries and tags. The output is `frontend/src/data/repos.json`.

## Alternatives considered
- Fully manual JSON: simple but drifts out of sync with GitHub.
- Live GitHub API from the browser: rate limited, no curation, shows every repo.

## Consequences
- Site content refreshes only on rebuild until the Phase 3 sync job moves this into the database.
- `projects.yaml` is the Phase 1 source of truth. The Phase 4 admin panel replaces it.
