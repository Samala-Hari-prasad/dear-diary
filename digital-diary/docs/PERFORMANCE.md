# Performance Targets

Digital Diary relies on GitHub as a backend. Because we do not control the database latency, client-side caching, rendering speed, and perceived performance are critical.

This document establishes the performance baselines for the application. Any feature that degrades these metrics should be reconsidered or optimized.

## Baseline Targets

| Operation                   | Target | Description |
| --------------------------- | ------ | ----------- |
| **Initial Page Load**       | < 1.5s | Time to interactive on the Discovery Dashboard. |
| **Command Palette Open**    | < 100ms| Must feel instantaneous to preserve keyboard flow. |
| **Search Latency**          | < 50ms | Client-side filtering of `index.json`. |
| **Open Entry**              | < 100ms| From click to editor ready. |
| **Autosave Feedback**       | < 250ms| Time from user stopping typing to "Saving..." indicator. |
| **Calendar Render**         | < 200ms| Rendering the full month view with entry indicators. |
| **Timeline Render**         | < 200ms| Rendering the grouped timeline with dynamic reading times. |

## Measurement Protocol
1. **Network Throttling**: Test initial load on "Fast 3G" setting.
2. **Device Emulation**: Ensure rendering targets are met on mid-tier mobile devices, not just M-series development machines.
3. **Cache Disabled**: Ensure initial loads without Next.js router cache still fall within acceptable boundaries.
