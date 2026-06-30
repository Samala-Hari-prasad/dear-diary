# AGENTS.md

Guidance for any AI agent (or human) continuing development on The Digital
Diary beyond v0.1.0.

## What This Project Is

A private, minimalist digital diary. The defining feeling is calm — like
opening a paper notebook. Every decision, visual or technical, should be
checked against that feeling before being merged.

## What Exists Today (v0.1.0)

- A static visual shell: header, sidebar, homepage, empty state.
- A light/dark theme system driven by CSS custom properties and `next-themes`.
- A small set of reusable UI primitives: `Button`, `Card`, `ThemeToggle`.
- No data layer of any kind. The "New Memory" button and sidebar items are
  not yet wired to any behavior.

## What Does NOT Exist Yet

Do not assume any of the following exist unless you have added them yourself:

- Authentication
- Persistent storage or a database
- A rich text or markdown editor
- API routes
- Global state management
- Autosave
- Image upload
- Search
- Calendar or collections views

## Directory Conventions

- `app/` — routes, layouts, and global styles only.
- `components/layout/` — structural, page-composing components.
- `components/ui/` — small, reusable, presentation-only primitives.
- `constants/` — static values and design tokens. No logic beyond pure
  helper functions (see `constants/app.ts` for the pattern).
- `docs/` — human- and agent-facing documentation.

Future milestones will introduce `hooks/`, `store/`, `lib/`, `api/`, and
`database/` directories. Do not create them prematurely.

## Code Quality Rules

- TypeScript strict mode stays on. Do not weaken `tsconfig.json`.
- Functions stay under 50 lines; components stay under 300 lines. Split
  components rather than growing them past this limit.
- No dead code, no commented-out code, no TODOs left in committed files.
- Reuse `components/ui/` primitives instead of duplicating markup.
- Keep the design system (see `docs/design-system.md`) as the single source
  of truth for color, type, spacing, and motion. Do not introduce shadows,
  gradients, glassmorphism, or neon accents.

## Working Style

- Make small, complete, compiling changes. Never leave the project in a
  state where `npm run dev` fails.
- Before adding a new dependency, check whether the existing stack (Next.js,
  TypeScript, Tailwind, next-themes, lucide-react) can already do the job.
- Read `docs/constitution.md` before making any product or design decision
  that isn't purely mechanical.
