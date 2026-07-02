# The Digital Diary

A private, Korean-minimalist digital diary. The application is designed to feel like opening a beautiful paper notebook: calm, elegant, and timeless. It is not a productivity app, not a dashboard, and not a note-taking SaaS product.

## Current Version

v1.0.0

## Completed

- Visual Shell
- Repository Connection
- Repository Reader (Read-Only)
- Memory Editor (Local Drafts)
- Repository Writer (Write API and Indexes)
- Synchronization Engine (Debounce, Sync Queue, Conflicts)
- Media Workspace (WebP Conversion and GitHub Uploads)
- Search Engine (Local Index Filtering)
- Calendar Timeline (Daily and Monthly Navigation)
- Collections and Organization (Archive, Tags, and Favorites)
- Production Hardening (Accessibility, Stability, QA)

## Next

- Authentication and Security (GitHub OAuth and Cookie Sessions)

## Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- next-themes
- lucide-react

## Getting Started

```bash
npm install
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
├── lib/                  Services, API clients, and query tokenizers
├── public/               Static assets
└── README.md
```

## Documentation

- docs/api-reference.md: REST endpoint payload formats and shapes.
- docs/repository-format.md: Repository database folder layouts and meta index schemas.
- docs/changelog.md: Historical release version change logs.
