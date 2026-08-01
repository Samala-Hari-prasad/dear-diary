# Architecture Checklist

This checklist acts as the final gatekeeper for all Pull Requests and architectural changes to Digital Diary.

**Before merging any code, verify:**

- [ ] GitHub remains the absolute source of truth.
- [ ] Markdown remains the canonical format.
- [ ] No new metadata files or schemas introduced without an explicit ADR.
- [ ] No duplicate save logic (all persistence flows through `lib/github/storage.ts`).
- [ ] Next.js Server Components are used by default; Client Components are isolated to interactive islands.
- [ ] No unnecessary client state (favor URL search parameters and server state).
- [ ] No new dependencies added without explicit justification.
- [ ] Build passes (`npm run build`).
- [ ] Lint passes (`npm run lint`).
- [ ] Manual QA completed across breakpoints.
