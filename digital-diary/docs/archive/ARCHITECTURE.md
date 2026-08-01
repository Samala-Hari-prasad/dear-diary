# Architecture Overview

The Digital Diary is built with a strictly layered architecture designed to keep the experience resilient, deterministic, and free from race conditions. 

## Architectural Layers

```
UI Components
      │
      ▼
Client Hooks (useMemoryActions)
      │
      ▼
MemoryService (Orchestrator)
      │
      ▼
Transaction Layer (Atomic Operations)
      │
      ▼
Repository (Data Access)
      │
      ▼
GitHub (Storage & Persistence)
```

### 1. UI Components & Client Hooks
React components (e.g. `PageList`, `EditorHeader`) manage presentation. They rely on standard hooks and specifically `useMemoryActions` to trigger mutations (create, delete, rename, duplicate). This layer is purely reactive and does not contain business logic for file handling.

### 2. Global Event System
To provide a fast, optimistic UX, the client relies on `TypedEventEmitter` (`lib/client/events.ts`). When a mutation succeeds or optimistic state changes are needed, events like `memory:updated`, `memory:deleted`, or `memory:restored` are dispatched globally. Components like the Sidebar listen to these events and update their internal lists without requiring a full page refresh.

### 3. MemoryService
The core orchestrator (`lib/repository/memory-service.ts`) sits between the API layer and the Transaction layer. It enforces business rules (e.g. "does this date already exist?", "is this a valid slug?") and decides which transaction pipeline to execute.

### 4. Transaction Layer
Because storing data in a GitHub repository is inherently non-relational and multi-file (e.g., updating both a markdown file and the meta-index JSON), the `Transaction` layer (`lib/repository/transaction.ts`) coordinates these atomic operations. It ensures that if one GitHub API call fails, the operation either aborts safely or remains consistent.

### 5. Repository Structure (GitHub)
The storage layer is a headless GitHub repository acting as the CMS:
- `/content/pages/`: Contains the actual `.md` block files.
- `/content/trash/`: Contains soft-deleted memories, preserving their original state for 5 seconds (or more) to allow easy restoration.
- `/content/index.json`: A lightweight, fast-loading registry of all active memories, tags, and metadata to avoid deeply reading directories on every load.

## Core Lifecycles

### Save Lifecycle
1. **Typing / Rename**: Modifies the `session` state locally. `isDirty` is set to true.
2. **Autosave Queue**: The `SyncQueue` buffers changes and debounces them (e.g. 3 seconds).
3. **Execution**: The `EditorContainer` POSTs the session to `/api/v1/diary/pages/save`.
4. **Service**: `MemoryService` triggers a save transaction.
5. **Storage**: The block file and `index.json` are both updated on GitHub.
6. **Completion**: The `EditorStatus` indicator shifts from `Saving...` to `Saved` (hidden after 2 seconds).

### Delete & Restore Lifecycle (Soft Delete)
1. **User Action**: User right-clicks a memory and selects "Delete".
2. **Optimistic UI**: The memory is immediately removed from the Sidebar via a `memory:deleted` event. A 5-second Undo toast appears.
3. **Service (Trash)**: The `/delete` API fires. `deleteMemoryTransaction` safely relocates the `.md` file from `content/pages/` to `content/trash/` and purges it from `index.json`.
4. **Undo Action**: If the user clicks Undo, the `/restore` API fires.
5. **Service (Restore)**: `restoreMemoryTransaction` relocates the file back to `content/pages/` and re-inserts it into `index.json`. A `memory:restored` event restores the UI instantly.
