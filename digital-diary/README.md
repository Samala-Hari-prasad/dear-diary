# The Digital Diary

> **Your journal. Your repository. Your Markdown. Nothing hidden.**
> **When the software disappears, the memories remain.**

The Digital Diary is a web-based, keyboard-first journal that treats a GitHub repository as the single source of truth. No databases. No proprietary formats. Just pure Markdown files synced instantly to your own remote repository. 

## Vision

A private, GitHub-backed Markdown notebook designed to feel like a paper journal while remaining transparent, portable, and durable.

## Project Principles

1. **GitHub is the only database.**
2. **Markdown is the canonical storage format.**
3. **Features must not compromise portability.**
4. **Prefer simplicity over abstraction.**
5. **User data is always transparent and recoverable.**
6. **The writing experience comes before everything else.**
7. **Every new feature must strengthen one of four pillars: Writing, Organization, Discovery, or Maintenance.**

## Current Version

**v1.0.0**

## Stack

- Next.js 15 (App Router & Server Actions)
- TypeScript
- Tailwind CSS
- `next-themes`
- `jose` (JWT sessions)
- GitHub REST API

## Getting Started

```bash
npm install
cp .env.example .env.local
# Fill in your variables in .env.local
npm run dev
```

Then open http://localhost:3000.

## Governance & Documentation

We maintain strict engineering discipline to prevent feature bloat and technical debt. Before contributing, please review:
- `docs/ROADMAP.md` (Product Pillars and Future Phasing)
- `docs/ADR/` (Architectural Decision Records)
- `docs/RELEASE.md` (Release & Quality Checklist)
- `AGENTS.md` (AI Contributor Rules)
