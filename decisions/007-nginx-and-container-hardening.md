# 007. nginx and container defaults

- Status: Accepted
- Date: 2026-10-15

## Context
The site is exposed to the internet through ngrok, so sensible defaults are needed from Phase 1.

## Decision
- Host port 8080 maps to nginx port 80. ngrok reaches nginx over the compose network (`web:80`), so only the inspector port is published, bound to `127.0.0.1:4040`.
- Security headers: `nosniff`, `X-Frame-Options: DENY`, strict referrer policy, and a restrictive CSP (`default-src 'self'`, inline styles allowed for React style props). Headers are repeated in nested locations because nginx `add_header` does not inherit when a location sets its own.
- Caching: `/assets/` immutable for a year (Vite hashes file names), `index.html` set to `no-cache`.
- Images pinned to major/minor tags (`node:22-alpine`, `nginx:1.27-alpine`); `ngrok/ngrok:latest` because the agent must stay current with the service.
- `NGROK_AUTHTOKEN` defaults to empty (`${NGROK_AUTHTOKEN:-}`). Compose's `:?` required-variable syntax was tried and rejected: it is evaluated for the whole file, so it blocked running `web` alone. The ngrok agent itself exits with a clear authtoken error when the value is missing.

## Alternatives considered
- Publishing nginx on port 80: needs privileges on some hosts and clashes with local services.

## Consequences
- If Phase 2 adds inline scripts or external resources, the CSP must be loosened deliberately.
- The `/api/` proxy block is commented out until Phase 2.
- Update 2026-10-15: CSP gained `font-src 'self' data:`. Vite inlines small font subsets as `data:` URIs, which `default-src 'self'` blocked (found via browser console during the UI redesign). `data:` fonts are inert, so this keeps the policy tight while avoiding a Vite `assetsInlineLimit` workaround.
