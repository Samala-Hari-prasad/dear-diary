# ADR 0001: GitHub as Primary Storage

**Date:** 2026-07-27
**Status:** Accepted

## Context
A digital diary requires persistent storage. Typical web architectures reach for databases (Postgres, MongoDB) or BaaS providers (Supabase, Firebase). However, personal diaries contain highly sensitive, lifelong data that must not be trapped in proprietary formats or subject to recurring hosting costs.

## Decision
We will use a private GitHub repository as the single source of truth and sole database for the application, interacting with it via the GitHub REST API.

## Consequences
**Pros:**
- Complete data ownership and transparency.
- Infinite free version control and history out-of-the-box.
- Zero database hosting costs.
- High portability (you can literally `git clone` your diary).

**Cons:**
- Slower read/write latency compared to a traditional DB.
- Strict API rate limits requiring robust retry and caching logic.
- Lack of complex querying capabilities (must be handled application-side).
