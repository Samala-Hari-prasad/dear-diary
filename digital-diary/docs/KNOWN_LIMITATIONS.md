# Known Limitations

Every architecture involves trade-offs. By choosing a GitHub-backed, database-free approach, the Digital Diary intentionally accepts the following limitations in exchange for longevity, ownership, and simplicity.

### 1. GitHub API Rate Limits Apply
Operations like loading the dashboard or saving entries rely on the GitHub API. 
* Unauthenticated requests are severely limited.
* Authenticated (OAuth) requests have a limit of 5,000 per hour.
While the application caches where possible and uses batch operations (like the Git Tree API for the Timeline), extreme usage could temporarily exhaust these limits.

### 2. Requires Internet Connection
Because GitHub is the single source of truth and there is no local database (like IndexedDB or SQLite), the application currently requires an active internet connection to read or write entries safely. Offline support is limited to pausing the autosave queue until connectivity returns.

### 3. Single Repository, Single User
The application maps 1:1 with a single private repository. It is not designed for multi-user collaboration, shared journals, or routing between multiple backend repositories simultaneously.

### 4. Large Repository Performance
The architecture fetches the `index.json` and Git Tree sizes to compute the Discovery Dashboard. While this scales comfortably to hundreds or even a few thousand entries, performance may degrade if the repository exceeds ~10,000 notes without further pagination or virtualization strategies.

### 5. No Native Full-Text Search
Because entries are not indexed in a traditional database (e.g., PostgreSQL or ElasticSearch), search relies entirely on what is available in `index.json` or client-side fuzzy searching (via Fuse.js). Deep, full-text searching across thousands of raw `.md` files would require downloading the entire repository, which is not currently supported.
