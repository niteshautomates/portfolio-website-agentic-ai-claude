# 009. Dark-first techy design system and motion rules

- Status: Accepted
- Date: 2026-10-15

## Context
The user chose a dark, techy / DevOps look. Light mode should still work, and the site must stay accessible.

## Decision
- Dark is the default theme. A saved choice (`localStorage`, in try/catch) wins, otherwise dark. The system preference is no longer used to default to light.
- Palette: near-black background, cyan to indigo accent gradient, subtle grid and radial glow backdrop, translucent "glass" cards with 1px borders.
- Typography: Inter for text, JetBrains Mono for terminal, labels and code-like accents.
- Motion: fade/slide-in on scroll (once), hover lift and glow on cards, CSS-only marquee, count-up stats, typing terminal. All of it is disabled or static under `prefers-reduced-motion`.
- Accessibility: visible focus rings, text contrast of at least 4.5:1 on both themes, semantic landmarks, buttons for toggles with `aria-pressed`.

## Alternatives considered
- Respect system theme as the default: more conventional, but the dark look is the identity the user picked.

## Consequences
- Light theme needs its own token values and a visual check.
- Any new component must use tokens, not hard-coded colours.
