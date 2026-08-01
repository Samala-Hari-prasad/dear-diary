# Core Philosophy

Digital Diary is a minimalist Markdown-first personal journal. It exists for ONE purpose: **Create beautiful personal journal entries that remain yours forever.**

Every technical and design decision must be measured against these guiding principles.

### 1. The software should disappear while writing.
Writing is the core interaction. The interface must remain calm, minimal, and entirely focused on getting words onto the screen. Features must reduce friction, not introduce complexity.

### 2. Markdown is the canonical representation.
We do not use proprietary data formats. We do not lock entries behind an API. An entry is a `.md` file. It can be read, edited, and understood with any text editor, fifty years from now.

### 3. GitHub is the only database.
No external databases (PostgreSQL, MongoDB, SQLite). No ORMs (Prisma, Drizzle). The repository's file system (`content/pages/` and `index.json`) is the absolute source of truth.

### 4. Simplicity is a feature.
Do not add capability for its own sake. When solving a problem, always prefer the solution that requires the least infrastructure, the fewest dependencies, and the least amount of code. 

### 5. Portability over convenience.
The application must always remain deployable to any standard hosting provider (Vercel, Cloudflare Pages, Netlify) without any code changes or additional infrastructure setup beyond environment variables. Vendor lock-in is explicitly rejected.

### 6. Read-only Discovery.
Features that help find older entries (Timeline, Calendar, Search) are **read-only visualizations** of existing repository data. They must never introduce a second source of truth.

---

Everything else—the roadmap, ADRs, release checklists, and implementation details—flows naturally from these principles.

> **"The best version of the Digital Diary is the one that lets its users forget it was built at all."**
