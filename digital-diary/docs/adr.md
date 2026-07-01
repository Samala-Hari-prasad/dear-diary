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
