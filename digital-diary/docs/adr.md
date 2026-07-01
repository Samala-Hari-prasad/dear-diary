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
