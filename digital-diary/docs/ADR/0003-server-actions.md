# ADR 0003: Server Actions over API Routes

**Date:** 2026-07-27
**Status:** Accepted

## Context
The application needs to communicate with GitHub to read and write files. We could build traditional REST API routes (`app/api/...`) and use `fetch` on the client, or we could use Next.js 15 Server Actions.

## Decision
We will use React Server Actions (e.g., `lib/actions/memory.ts`) for all data mutations instead of building REST API routes.

## Consequences
**Pros:**
- Significantly reduces boilerplate code (no need for `fetch` wrappers or API route handlers).
- End-to-end type safety between the server and the client component.
- Keeps GitHub logic securely on the server without exposing internal endpoints.

**Cons:**
- Tightly couples the frontend components to the Next.js framework.
- Error handling requires a specific return pattern rather than standard HTTP status codes.
