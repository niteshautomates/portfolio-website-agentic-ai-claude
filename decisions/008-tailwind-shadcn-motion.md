# 008. UI stack: Tailwind v4 + shadcn-style components + Motion

- Status: Accepted
- Date: 2026-10-15
- Supersedes: [005](005-single-page-sections-plain-css.md) (plain CSS part only; single-page, no-router stays)

## Context
The Phase 1 UI (hand-written CSS, flat cards, no motion) was functional but not appealing. The user asked for modern components and a more attractive site before backend work starts.

## Decision
- Tailwind CSS v4 via `@tailwindcss/vite`, with design tokens as CSS variables (shadcn naming: `--background`, `--card`, `--primary`, ...).
- shadcn-style UI primitives in `src/components/ui/` (Button, Badge, Card, Input) built on `class-variance-authority`, `clsx` and `tailwind-merge`, with a `cn()` helper in `src/lib/utils.ts`. Components are owned code, not a runtime dependency.
- `motion` (Framer Motion) for entrance, hover and counter animations.
- `lucide-react` for UI icons, `react-icons/si` (Simple Icons) for brand logos.
- Path alias `@/` -> `src/`.

## Alternatives considered
- Plain CSS with animations: no new deps, but too much hand-written work for the target look.
- Component libraries with their own runtime theme (MUI, Chakra): heavier and harder to match a custom techy look.

## Consequences
- `src/index.css` is replaced by Tailwind layers and tokens.
- Radix-based shadcn pieces (Tabs, Sheet) are avoided in Phase 1.5; filter chips and the mobile menu are small hand-written components to keep the bundle small.
- Router and admin UI in later phases can reuse the same primitives.
