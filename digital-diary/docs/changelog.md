# Changelog

All notable changes to this project will be documented in this file.

## [v0.5.0] - 2026-07-02
### Added
- Low-level writer service `writePageContent` to PUT files using GitHub Contents API.
- Low-level index writer `updateIndexFiles` to update the meta-index JSON list.
- Centralized transaction coordinator `saveEditorSession` to enforce write sequencing.
- Standardized POST API route `/api/v1/diary/pages/save` with CONFLICT error mappings.
- Custom `<SaveButton />` with Loading, Saved, and Conflict feedback loops.

## [v0.4.0] - 2026-07-02
### Added
- Rich-text editor capability using BlockNote with Mantine core styling (compatibly aligned to v7).
- Extensible `EditorSession` to bundle page selection parameters, dates, and block state.
- Isolation Adapter layer (`lib/editor/adapter.ts`, `serializer.ts`, `deserializer.ts`) separating editing canvas schemas from repository models.
- Quiet presentational `<EditorStatus />` bar, dynamic dynamic SSR `<EditorContainer />`, and Title/Tag inputs `<EditorHeader />`.
- Toggles in `<PageView />` supporting seamless transition between preview (read) and write (edit) states.
- Local drafts creation when clicked "New Memory" in the app interface.

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
