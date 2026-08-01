# Digital Diary: Master Blueprint & Roadmap

## Project Principles

1. **GitHub is the only database.**
2. **Markdown is the canonical storage format.**
3. **Features must not compromise portability.**
4. **Prefer simplicity over abstraction.**
5. **User data is always transparent and recoverable.**
6. **The writing experience comes before everything else.**
7. **Every new feature must strengthen one of four pillars: Writing, Organization, Discovery, or Maintenance.**

## Vision
> **A private, GitHub-backed Markdown notebook designed to feel like a paper journal while remaining transparent, portable, and durable.**

## Non-Goals

The Digital Diary intentionally does not aim to be:
- A productivity suite or task manager
- A team collaboration platform
- A social network
- An AI writing assistant
- A knowledge management system replacing full PKM tools (like Obsidian or Roam)
- A cloud-first application with proprietary storage

Features that move the project toward these goals should generally be rejected unless they clearly support the project's core vision.

---

## Product Pillars

### Pillar 1 — Writing Experience (Highest Priority)
*The heart of the application. Everything that makes writing smoother.*
- Keyboard Shortcuts
- Image Compression & Drag-and-Drop Images
- Better image paste support (Ctrl/Cmd+V)
- Improve Markdown rendering with support for GitHub Flavored Markdown (tables, task lists, images, fenced code blocks, etc.)
- Word Count & Reading Time
- Auto-resizing editor
- Markdown formatting shortcuts (`#`, `##`, `-`, `>`, etc.)
- Focus mode & Full-screen editor

### Pillar 2 — Organization
*Decoupling metadata from Markdown frontmatter to keep things fast and clean.*
- **Storage**: Centralized in `content/metadata/` (`tags.json`, `collections.json`, `favorites.json`, `pinned.json`)
- Tags & Collections
- Favorites & Pin Notes

### Pillar 3 — Discovery
*Navigating and resurfacing memories.*
- Calendar & Timeline Views
- Search & Recent entries
- Filter by tag / collection
- **Today in History**: e.g., showing entries from this exact date in past years.
- **Backlinks**: Parsing `[[Link]]` syntax to show related notes and create an interconnected feel.

### Pillar 4 — Maintenance
*Keeping the repository healthy.*
- Repository Repair Tool (regenerates `index.json`, detects orphaned images and duplicate slugs)
- Export ZIP & Export Markdown
- Import Markdown
- Integrity checker

---

## Execution Phasing

### **v1.1**
*Read-only discovery and core writing polish. No persistence model changes required.*
- Calendar View
- Timeline View
- Keyboard Shortcuts
- Improve Markdown rendering with GitHub Flavored Markdown
- Drag-and-drop Images
- Image Compression

### **v1.2**
*The Organization and Resurfacing layer.*
- Tags & Collections
- Favorites & Pin Notes
- Recent Notes
- "Today in History"

### **v1.3**
*The Maintenance and Interconnectivity layer.*
- Backlinks
- Export Markdown / ZIP
- Import Notes
- Repository Repair Tool

### **v2.0**
*(Only after months of real-world usage)*
- Encryption
- Offline mode
- Sync queue
- Multiple journals
