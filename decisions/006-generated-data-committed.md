# 006. Generated data files are committed; Docker build needs no GitHub access

- Status: Accepted
- Date: 2026-10-15

## Context
ADR-002 generates `repos.json` and `profile.json` from GitHub and `content/*.yaml`. The Docker build should be reproducible and not depend on GitHub's API availability or rate limits.

## Decision
- `npm run fetch:github` is run manually on the host, and its outputs (`frontend/src/data/repos.json`, `profile.json`) are committed.
- The Dockerfile only runs `npm ci && npm run build`.
- If the fetch fails but `repos.json` exists, the script keeps the old file and exits 0. If it fails with no existing file, it exits non-zero.
- `profile.yaml` is separate from `projects.yaml` so personal details and project curation change independently.
- The public contact email is not pre-filled; it is set by the user in `content/profile.yaml` because it ends up on a public page.

## Alternatives considered
- Run the fetch inside the Docker build: always fresh, but the build breaks on rate limits and offline builds.

## Consequences
- Refreshing the site after a new GitHub repo needs: fetch, commit, rebuild.
- Phase 3's sync job removes this manual step.
