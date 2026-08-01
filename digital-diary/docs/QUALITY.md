# Quality Gates

Every feature, pull request, and major milestone in the Digital Diary must satisfy the following engineering standards before being considered "Done".

## Architecture
- **GitHub remains the only database.** No external databases, No ORMs.
- **Markdown remains canonical.** The file system represents the truth.
- **No duplicated business logic.** Keep core functions (like `performSave`) independent and reusable.

## Code
- **Strict TypeScript.** 
- **No `any`.** 
- **No dead code.** Remove unused imports and functions before merging.
- **Pure utilities where appropriate.** (e.g. `compressImage` takes a file and returns a file, no side-effects).

## Performance
- **No unnecessary client components.** Server components by default.
- **Lazy-load heavy UI.**
- **Images optimized.** Enforce client-side WebP compression and strict maximum resolutions.

## Accessibility
- **Keyboard accessible.** Everything must be reachable without a mouse.
- **Focus visible.** Ensure native or explicit focus rings are never suppressed.
- **ARIA where appropriate.** Use semantic HTML and `aria-` labels for screen readers.

## Testing
- **Manual QA checklist completed.**
- **Lint passes.**
- **Build passes.**

## Documentation
- **CHANGELOG updated.**
- **ADR updated** if architecture changed.
- **RELEASE checklist reviewed.**
