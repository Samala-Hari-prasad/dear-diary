# AGENTS.md

Guidance for any AI agent (or human) continuing development on The Digital Diary beyond v1.0.0.

## Project Principles & Vision

**Vision**: A private, GitHub-backed Markdown notebook designed to feel like a paper journal while remaining transparent, portable, and durable.

1. **GitHub is the only database.**
2. **Markdown is the canonical storage format.**
3. **Features must not compromise portability.**
4. **Prefer simplicity over abstraction.**
5. **User data is always transparent and recoverable.**
6. **The writing experience comes before everything else.**
7. **Every new feature must strengthen one of four pillars: Writing, Organization, Discovery, or Maintenance.**

(See `docs/ROADMAP.md` for the full product blueprint and phasing.)

## What Exists Today (v1.0.0)

- A functional GitHub-backed Markdown storage architecture.
- JWT-based authentication and secure cookies.
- Creating, Editing, Autosaving, Searching, and Deleting (Trash) features.
- A light/dark theme system driven by CSS custom properties and `next-themes`.

## What Does NOT Exist Yet

Do not assume any of the following exist unless you have added them yourself:

- A full database (Prisma, Postgres, etc.)
- Collections or tags metadata storage
- A Calendar or Timeline view

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
