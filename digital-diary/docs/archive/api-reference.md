# API Reference Specification

This document defines the REST API endpoints and payload contracts for **The Digital Diary** application. All endpoints are relative to the `/api/v1` namespace.

---

## 1. System Health & Setup

### `GET /api/v1/system/status`
Verifies connection parameters and credentials with the private GitHub storage repository.
- **Request Parameters**: None
- **Response Shape**:
  ```json
  {
    "success": true,
    "data": {
      "connected": true,
      "owner": "username",
      "repo": "dear-diary",
      "branch": "main",
      "status": "Healthy"
    }
  }
  ```

---

## 2. Directory & Manifest Queries

### `GET /api/v1/diary/manifest`
Loads global configuration metadata and repository version numbers.
- **Request Parameters**: None
- **Response Shape**:
  ```json
  {
    "success": true,
    "data": {
      "version": "1.0.0",
      "owner": "username",
      "repo": "dear-diary",
      "createdAt": "2026-06-30T12:00:00Z"
    }
  }
  ```

### `GET /api/v1/diary/pages`
Loads the page metadata summary registry index (`meta-index.json`). Returns entries sorted by `updatedAt` desc.
- **Request Parameters**: None
- **Response Shape**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "graduation-day",
        "slug": "graduation-day",
        "title": "Graduation Day",
        "cover": null,
        "updatedAt": "2026-07-02T12:00:00.000Z",
        "tags": ["personal", "milestone"]
      }
    ]
  }
  ```

---

## 3. Entry Read / Write Operations

### `GET /api/v1/diary/pages/[slug]`
Fetches the content payload and file version SHA for a specific entry.
- **Path Parameters**: `slug` (string) - The unique slug identifier.
- **Response Shape**:
  ```json
  {
    "success": true,
    "data": {
      "summary": {
        "id": "graduation-day",
        "slug": "graduation-day",
        "title": "Graduation Day",
        "cover": null,
        "updatedAt": "2026-07-02T12:00:00.000Z",
        "tags": ["personal", "milestone"]
      },
      "blocks": [
        {
          "id": "block-1",
          "type": "paragraph",
          "content": "Graduation text..."
        }
      ],
      "sha": "4bdb1b5..."
    }
  }
  ```

### `POST /api/v1/diary/pages/save`
Saves or updates a memory session document, updates `meta-index.json`, and handles optimistic conflict checks.
- **Request Body**:
  ```json
  {
    "session": {
      "pageId": "graduation-day",
      "title": "Graduation Day",
      "tags": ["personal", "milestone"],
      "content": [
        {
          "id": "block-1",
          "type": "paragraph",
          "content": "Graduation text..."
        }
      ],
      "isDirty": false,
      "mode": "read",
      "createdAt": "2026-07-02T12:00:00.000Z",
      "updatedAt": "2026-07-02T12:00:00.000Z",
      "sha": "4bdb1b5..."
    }
  }
  ```
- **Response Shape**:
  ```json
  {
    "success": true,
    "data": {
      "sha": "new-sha-value...",
      "slug": "graduation-day",
      "updatedAt": "2026-07-02T12:05:00.000Z"
    }
  }
  ```

---

## 4. Media Workspace

### `POST /api/v1/diary/media`
Resizes and stores custom binary image attachments as WebP files on GitHub.
- **Request Body**:
  ```json
  {
    "filename": "sunset.png",
    "content": "base64-string-payload...",
    "size": 184320,
    "width": 1200,
    "height": 800
  }
  ```
- **Response Shape**:
  ```json
  {
    "success": true,
    "data": {
      "id": "uuid-v4-string",
      "filename": "uuid-v4-string.webp",
      "path": "assets/images/2026/07/uuid.webp",
      "url": "https://raw.githubusercontent.com/owner/repo/main/path/uuid.webp",
      "mimeType": "image/webp",
      "width": 1200,
      "height": 800,
      "size": 184320,
      "uploadedAt": "2026-07-02T12:10:00.000Z"
    }
  }
  ```

---

## 5. Search Engine

### `GET /api/v1/search`
Retrieves entry metadata summaries matching specific search criteria.
- **Request Query**: `q` (string) - Keywords to query.
- **Response Shape**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "graduation-day",
        "slug": "graduation-day",
        "title": "Graduation Day",
        "cover": null,
        "updatedAt": "2026-07-02T12:00:00.000Z",
        "tags": ["personal", "milestone"]
      }
    ],
    "meta": {
      "query": "graduation",
      "count": 1
    }
  }
  ```
