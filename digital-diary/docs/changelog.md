# Changelog

All notable changes to this project will be documented in this file.

## [v0.3.0] - 2026-07-01
### Added
- central database services for loading manifest, meta-indexes, and pages.
- Facade service wrapper (`RepositoryService`) in `lib/github/repository.ts`.
- Structured page models (`DiaryPage`, `DiaryPageSummary`).
- Consistent API endpoints (`/api/v1/diary/manifest`, `/api/v1/diary/pages`, `/api/v1/diary/pages/[slug]`).
- Dumb presentational `<PageList />` and `<PageView />` components with extensible `<DocumentRenderer />` blocks.
- Skeletons and orchestrators in `app/page.tsx` for clean loading UI.

## [v0.2.0] - 2026-07-01
### Added
- GitHub service layer client helper (`lib/github/client.ts`).
- Centralized server-side configuration helper (`lib/config/env.ts`).
- Strongly-typed health checks and validation for `manifest.json` schema (`lib/github/health.ts`).
- Centralized system status endpoint (`/api/v1/system/status`).
- Storage-agnostic `<RepositoryStatus />` component to show connection details cleanly in the UI.

### Changed
- Replaced custom Tailwind overrides with standard Tailwind spacing equivalents across app page layout and UI primitives.
- Styled `ThemeToggle` as a clean, segmented Light/Dark/System selector.
- Refined empty state copy to a warmer, more human tone.

## [v0.1.0] - 2026-06-30
### Added
- Core application shell layout (header, sidebar, main area).
- Theme toggle with next-themes.
- Design tokens, Cormorant Garamond / Inter typography, and baseline responsive UI.
