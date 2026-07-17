# The Digital Diary

A private, Korean-minimalist digital diary. The application is designed to feel like opening a beautiful paper notebook: calm, elegant, and timeless. It is not a productivity app, not a dashboard, and not a note-taking SaaS product.

> **Every new feature must remove more friction than it introduces complexity.**

## Current Version

v1.2.1

## Release Status

Stable

## Completed

- Visual Shell
- GitHub Repository Integration
- Repository Reader
- Memory Editor (Local Drafts)
- Repository Writer (Write API and Indexes)
- Synchronization Engine (Debounce, Sync Queue, Conflicts)
- Media Workspace (WebP Conversion and GitHub Uploads)
- Search Engine (Local Index Filtering)
- Calendar Timeline (Daily and Monthly Navigation)
- Collections and Organization (Archive, Tags, and Favorites)
- Production Hardening (Accessibility, Stability, QA)
- Authentication and Security (GitHub OAuth and Cookie Sessions)
- Authorization and Route Protection (Middleware)
- UX Polish & Session Experience (Network Failures, Loading States, Redirects)

## Next

- Editor enhancements and writing experience improvements.
- Additional export formats.
- Continued stability and performance improvements.

## Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- next-themes
- lucide-react
- jose (JWT sessions)
- GitHub OAuth

## Getting Started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Then open http://localhost:3000.

## Project Structure

```text
dear-diary/
├── app/                  Routes, root layout, and API routes
├── components/           Layout views, sidebar, search, and calendar panels
├── constants/            Design tokens and app-level constants
├── docs/                 Changelogs, API specs, and storage formats
├── lib/                  
│   ├── auth/             Authentication and session logic
│   ├── github/           GitHub client and repo operations
│   ├── api/              Centralized API wrappers
│   └── config/           Environment definitions
├── public/               Static assets
└── README.md
```

## Architecture

The application uses a single-repository architecture.

- Next.js App Router
- GitHub Contents API for storage
- GitHub OAuth for identity
- JWT cookie sessions
- Middleware-based authorization
- Client-side synchronization and offline drafts

## Documentation

- docs/api-reference.md: REST endpoint payload formats and shapes.
- docs/repository-format.md: Repository database folder layouts and meta index schemas.
- docs/changelog.md: Historical release version change logs.
