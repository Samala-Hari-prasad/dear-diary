# ADR 0004: Centralized Metadata

**Date:** 2026-07-27
**Status:** Accepted

## Context
In Markdown-based systems (like Hugo or Jekyll), metadata (tags, dates, collections) is traditionally stored in YAML frontmatter at the top of every file. While this keeps files self-contained, parsing thousands of files just to build a list of tags or a calendar view is extremely expensive over the GitHub API.

## Decision
We will separate the document content from its metadata. Content lives in `content/pages/*.md`, while all metadata is centralized into singular JSON indices (e.g., `content/index.json`, `content/metadata/tags.json`).

## Consequences
**Pros:**
- Drastically reduces GitHub API calls. Building the sidebar or calendar requires fetching exactly one file (`index.json`) instead of 500 files.
- Makes renaming tags or collections an O(1) file operation instead of an O(N) file operation.

**Cons:**
- Introduces the risk of desynchronization (a markdown file exists, but isn't in the index). This necessitates the future creation of a "Repository Repair Tool" to heal the index if it falls out of sync.
