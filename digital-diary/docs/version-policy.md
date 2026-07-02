# Version Policy Specification

This document defines the semantic versioning conventions for **The Digital Diary** repository schema and application APIs.

## Semantic Version Rules

Given a version number `MAJOR.MINOR.PATCH`, increment the:

- **MAJOR** version when you make incompatible API or storage format changes (e.g., changing the structure of `meta-index.json` or `pages/*.json` in a way that breaks reading/writing older entries).
- **MINOR** version when you add functionality in a backward compatible manner (e.g., adding a new database file such as `tags.json` while maintaining reading/writing operations on existing files).
- **PATCH** version when you make backward compatible bug fixes, documentation cleanups, and UI performance refinements.

## Invariant Storage Contracts
To protect user diaries, all upgrades must maintain backward compatibility for reading older diary page JSON formats. If a MAJOR version upgrade is required, the application must supply automatic migration utilities at the database layer.
