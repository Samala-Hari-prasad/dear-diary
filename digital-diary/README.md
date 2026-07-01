# The Digital Diary

A private, Korean-minimalist digital diary. The application is designed to feel
like opening a beautiful paper notebook — calm, elegant, and timeless. It is
not a productivity app, not a dashboard, and not a note-taking SaaS product.

## Current Version

v0.2.0

## Completed

- ✔ Visual Shell
- ✔ Repository Connection

## Next

- → Repository Reading (Read-Only)

## Stack

- Next.js 15 (App Router)
- TypeScript (strict mode)
- Tailwind CSS
- next-themes
- lucide-react

## Getting Started

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
app/                  Routes, root layout, global styles
components/layout/    Structural components (header, sidebar, shell)
components/ui/        Reusable primitives (button, card, theme toggle)
constants/            Design tokens and app-level constants
docs/                 Project documentation for contributors and agents
public/               Static assets
```

## Documentation

- `docs/INDEX.md` — documentation map
- `docs/constitution.md` — non-negotiable project principles
- `docs/design-system.md` — typography, color, spacing, and motion rules
- `docs/definition-of-done.md` — scope and completion criteria for v0.1.0
- `AGENTS.md` — guidance for AI agents continuing development
