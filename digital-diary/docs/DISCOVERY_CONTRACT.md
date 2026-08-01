# Discovery Contract

This document defines the architectural constraints and goals for all features related to "Discovery" (Timeline, Calendar, Search, etc.) in the Digital Diary.

## Purpose
> Help users rediscover existing memories without changing how those memories are stored.

## Success Criteria
* Find an entry by date in under 10 seconds.
* Navigate without remembering entry titles.
* Discovery remains keyboard-accessible.
* Timeline and Calendar are read-only views over existing repository data.

## Non-goals
* Editing from the calendar.
* Dragging entries between dates.
* Multiple calendars.
* Event scheduling.
* Reminders.
* Metadata that duplicates Markdown content.

## Architecture Constraints
* No new storage layer.
* No database.
* No additional canonical metadata.
* `index.json` remains the single navigation index.
* Timeline and Calendar derive all information from existing repository data.

## Core Principle
> **Every Discovery view must be derivable from the repository without introducing new persistent state.**

This means:
* Timeline = derived
* Calendar = derived
* Reading time = computed
* Activity = computed
* On This Day = computed

Nothing should require writing new metadata back into the repository. This preserves the elegance of the GitHub-backed architecture.
