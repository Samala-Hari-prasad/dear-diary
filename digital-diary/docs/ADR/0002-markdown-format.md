# ADR 0002: Markdown as Canonical Format

**Date:** 2026-07-27
**Status:** Accepted

## Context
Diaries are text-heavy. Modern applications often store rich text as JSON (e.g., Slate.js, Lexical, BlockNote) or HTML to easily support complex formatting, embeds, and drag-and-drop block editing. 

## Decision
All diary entries will be stored as raw Markdown (`.md`) files.

## Consequences
**Pros:**
- Ultimate portability: Markdown files can be opened by any text editor on any device, decades from now.
- Human-readable without needing the application to render it.
- Pairs perfectly with GitHub storage.

**Cons:**
- Requires parsing and rendering steps in the UI.
- Advanced layout features (like multi-column layouts) are difficult to support natively without custom syntax that breaks standard Markdown portability.
