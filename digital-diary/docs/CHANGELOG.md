# Changelog

All notable changes to the Digital Diary will be documented in this file.

## [v1.1.0-rc1] - 2026-07-30

### Added
* Write / Split / Preview editor modes.
* GitHub Flavored Markdown rendering.
* Cmd/Ctrl+S immediate save.
* Drag-and-drop image uploads.
* Clipboard image paste.
* Client-side image compression.
* Formal save-state lifecycle.

### Improved
* Reduced interruptions during writing.
* Faster image uploads.
* Cleaner Markdown preview.
* Better feedback during save operations.

### Architecture
* No changes to storage.
* No changes to repository layout.
* No changes to authentication.
* No new metadata.
* GitHub remains the single source of truth.

## [v1.0.0] - 2026-07-27

### Added
* A functional GitHub-backed Markdown storage architecture.
* JWT-based authentication and secure cookies.
* Creating, Editing, Autosaving, Searching, and Deleting (Trash) features.
* A light/dark theme system driven by CSS custom properties and `next-themes`.
