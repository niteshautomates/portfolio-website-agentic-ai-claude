# 011. Profile content comes from profile.yaml; nothing invented

- Status: Accepted
- Date: 2026-10-15

## Context
The redesign adds a terminal, stats and an experience timeline. These could easily be filled with made-up numbers, dates or achievements on a public page.

## Decision
- Terminal lines, years of experience and the experience timeline are read from `content/profile.yaml` (`terminal`, `yearsExperience`, `experience`).
- Project counts, languages and featured counts are derived from `repos.json`.
- Anything the user has not supplied is either omitted (e.g. years of experience stat) or shown as an obvious placeholder in the YAML marked `TODO`. The only seeded experience entry is the known fact: Lead DevOps Engineer at Allianz Technologies, Pune.
- Placeholder text must be easy to find: grep for `TODO` in `content/`.

## Alternatives considered
- Plausible filler content: looks finished, but publishes claims that may be false.

## Consequences
- The site can look sparse in the experience section until the user fills the YAML.
- Content updates need only `npm run fetch:github` and a rebuild (ADR-006).
- Update 2026-10-15: `links.phone` is optional and user-supplied. The Call button and number render only when it is non-empty, so no placeholder number is ever published. It is public (visible in the page and the JS bundle), so it can be scraped and may attract spam calls; the user asked for it to be shown publicly. `telHref()` in `frontend/src/lib/utils.ts` turns it into a `tel:` link.
