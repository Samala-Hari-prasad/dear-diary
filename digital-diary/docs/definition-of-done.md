# Definition of Done — v0.1.0 "Visual Shell"

This document defines the exact scope of release v0.1.0. A change is only
considered part of this milestone if it falls within the boundaries below.

## In Scope

- Next.js 15 App Router project scaffold (TypeScript, strict mode).
- Tailwind CSS configured with the design system's color, type, and spacing
  tokens.
- Light and dark themes via `next-themes`, toggleable from the header.
- Root layout with the heading (Cormorant Garamond) and body (Inter) fonts
  loaded via `next/font/google`.
- App shell composed of a header, a sidebar, and a main content area.
- Homepage displaying:
  - The app name
  - A time-aware greeting ("Good Morning / Afternoon / Evening, {name}")
  - The tagline, "Every memory deserves a place."
  - A "New Memory" call-to-action button (visual only — no behavior yet)
  - An empty state ("No memories yet. Begin your first page.")
- Reusable UI primitives: `Button`, `Card`, `ThemeToggle`.
- Responsive layout across mobile, tablet, laptop, and desktop widths.
- Baseline accessibility: semantic landmarks, keyboard focus visibility, and
  `prefers-reduced-motion` support.
- Documentation: `README.md`, `AGENTS.md`, and the files in `docs/`.

## Explicitly Out of Scope

The following are deliberately not implemented in this release, and their
absence is not a bug:

- Authentication of any kind
- Any backend, API route, or database
- Persistent storage (local or remote) for entries
- A text or rich-text editor
- Autosave or any save behavior at all
- Global state management
- Image upload
- Search
- Calendar or collections views

## Acceptance Criteria

- `npm install && npm run dev` succeeds with no errors.
- `npm run build` succeeds with no type errors.
- The homepage matches the layout described above at mobile, tablet,
  laptop, and desktop widths.
- Toggling the theme switches all colors via the documented light/dark
  tokens with no flash of unstyled content beyond what `next-themes`
  inherently introduces.
- No file outside the directories listed in `AGENTS.md` (`app/`,
  `components/`, `constants/`, `docs/`, `public/`) has been introduced.
