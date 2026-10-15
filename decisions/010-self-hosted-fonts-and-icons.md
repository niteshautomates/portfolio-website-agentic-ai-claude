# 010. Self-hosted fonts and bundled icons

- Status: Accepted
- Date: 2026-10-15

## Context
nginx sends `Content-Security-Policy: default-src 'self'` (ADR-007), which blocks Google Fonts and CDN assets. The site is also served through ngrok, so fewer third-party requests is better.

## Decision
- Fonts come from `@fontsource-variable/inter` and `@fontsource-variable/jetbrains-mono`, bundled by Vite and served from `'self'`.
- Icons are imported as components (`lucide-react`, `react-icons/si`) and tree-shaken into the JS bundle. No icon fonts or remote SVGs.
- Tech names map to icons in `src/lib/tech-icons.ts`. Unknown names fall back to a generic icon.

## Alternatives considered
- Google Fonts / CDN icons: simpler, but needs a looser CSP and adds third-party requests.

## Consequences
- CSP stays strict.
- Bundle includes only the icons actually referenced in the map.
