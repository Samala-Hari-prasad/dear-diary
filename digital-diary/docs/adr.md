# Architecture Decision Records (ADR) Log

## ADR-008: Repository Health Service

### Context
We need to verify the connection and health of the storage backend (GitHub repository) from the application. 

### Decision
Health checks are centralized through server-side functions in `lib/github/health.ts` and returned via a standardized `/api/v1/system/status` API endpoint.

### Consequences
- UI remains completely storage-agnostic, receiving standard `RepositoryHealth` payloads rather than raw GitHub payloads.
- Future storage engines require only service replacement under `lib/` without affecting frontend status card UI components.
- API routes remain clean orchestration layers, offloading details to service functions.

## ADR-009: Editor Independence

### Context
We want to integrate a rich-text writing experience (e.g. BlockNote editor) without coupling our persistent repository storage format directly to any third-party library schemas.

### Decision
The permanent repository format shall never be the native serialization format of any editor library. We will map between the editor's model and the application's clean storage block models via an adapter layer.

### Consequences
- BlockNote or any editor component can be modified or fully replaced in the future without requiring migration of stored diary entries.
- The storage format remains clean, standardized, and fully portable.

## ADR-010: Repository Write Orchestration

### Context
Saving a diary page requires multiple repository updates (e.g. writing the content file, updating index lists).

### Decision
All save operations must pass exclusively through a centralized save coordinator (`lib/repository/save.ts`). Low-level GitHub services (`write.ts` and `index-writer.ts`) remain single-purpose and must never invoke each other directly.

### Consequences
- Repository pipeline logic remains centralized and decoupled.
- Low-level write utilities remain single-purpose and reusable.
- Future autosave, retry queues, and offline synchronization mechanisms can reuse the same save coordinator without restructuring database layers.

## ADR-011: Automatic Background Synchronization

### Context
Manual save actions interrupt user writing flow. We want changes to persist in the background reliably while protecting data integrity.

### Decision
Synchronization is performed automatically after a 3-second debounce using a generic sequential task queue.
- Only one synchronization request may execute simultaneously.
- Queued snapshots replace obsolete pending snapshots.
- Synchronization never cancels an active save (awaits completion, then executes the newest snapshot).
- Synchronization conflicts never discard local editor state.

### Consequences
- Writing remains uninterrupted while repository consistency is maintained.
- Data integrity is protected via sequential, non-overlapping saves and SHA conflict checking.
- Obsolete intermediate writes are discarded, minimizing API depletion rate.
