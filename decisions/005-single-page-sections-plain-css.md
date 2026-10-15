# 005. Single-page sections, plain CSS, no router

- Status: Partly superseded by [008](008-tailwind-shadcn-motion.md) (styling); single-page/no-router still applies
- Date: 2026-10-15

## Context
Phase 1 has four sections (Hero/About, Projects, Skills, Contact) and no separate pages. Styling and routing libraries add dependencies we do not yet need.

## Decision
- One page with anchor navigation, no `react-router`. nginx still has the SPA `try_files` fallback so a router can be added in Phase 3 (blog) without infra changes.
- Plain CSS with custom properties for light/dark theming (`data-theme` on `<html>`, default from `prefers-color-scheme`, choice kept in `localStorage` inside try/catch).
- Project filtering is client-side state (Featured, All, or a language).

## Alternatives considered
- Tailwind / component library: faster to style, but extra build config and dependencies for a small UI.
- react-router now: unused until the blog and admin phases.

## Consequences
- Phase 3 adds `react-router` for blog and admin routes.
- Visual polish is limited to what hand-written CSS provides.
