# Repository Storage Format Specification

This document defines the storage layout and data schemas for **The Digital Diary** repository, acting as the long-term storage contract between the application client and the GitHub storage backend.

## Directory Structure

All files reside in the root of the user's private diary repository:

```
├── manifest.json
├── content/
│   ├── index/
│   │   ├── meta-index.json
│   │   ├── tags.json         (reserved for v0.8.0)
│   │   └── collections.json  (reserved for v0.8.0)
│   └── pages/
│       └── {slug}.json
└── assets/
    └── images/
        └── {YYYY}/
            └── {MM}/
                └── {uuid}.webp
```

---

## Data Schemas

### 1. manifest.json
Defines repository-wide metadata and schema versions:
```json
{
  "version": "1.0.0",
  "owner": "username",
  "repo": "dear-diary",
  "createdAt": "2026-06-30T12:00:00Z"
}
```

### 2. content/index/meta-index.json
Standard page list registry sorted by `updatedAt` desc in application runtime:
```json
{
  "pages": [
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

### 3. content/pages/{slug}.json
Structure of individual memory entries containing blocks:
```json
{
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
      "type": "heading",
      "props": { "level": 1 },
      "content": "Graduation Day"
    },
    {
      "id": "block-2",
      "type": "paragraph",
      "content": "Today I graduated..."
    }
  ]
}
```

### 4. assets/images/{YYYY}/{MM}/{uuid}.webp
Binary image attachments. Filenames are generated using standard UUID v4 converted to optimized WebP.
- Maximum dimensions: 1200px (width or height).
- Quality: 82%.
- Target file size limit: 250 KB.
