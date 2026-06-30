# Design System

The Digital Diary's design system exists to protect one feeling: calm. Every
rule below exists in service of that, not as decoration for its own sake.

## Typography

| Role     | Typeface             |
| -------- | --------------------- |
| Headings | Cormorant Garamond     |
| Body     | Inter                  |

Headings should feel light and editorial, not bold or shouting. Prefer font
weights of 300–500 for headings; reserve heavier weights for rare emphasis.

## Color

### Light Theme

| Token      | Value      |
| ---------- | ---------- |
| Background | `#FAF9F6`  |
| Foreground | `#1C1B1A`  |
| Accent     | `#4A574E`  |
| Border     | `#E8E7E3`  |

### Dark Theme

| Token      | Value      |
| ---------- | ---------- |
| Background | `#141413`  |
| Foreground | `#E5E4E0`  |
| Accent     | `#8FA499`  |
| Border     | `#2C2B29`  |

Colors are exposed as CSS custom properties in `app/globals.css`
(`--color-background`, `--color-foreground`, `--color-accent`,
`--color-border`) and surfaced to Tailwind via `tailwind.config.ts`. Always
use the Tailwind utility classes (`bg-background`, `text-foreground`, etc.)
rather than hard-coded hex values in components.

## Spacing

A fixed scale, in pixels: `4, 8, 12, 16, 24, 32, 48, 64`. These are available
as both Tailwind spacing values and as exported constants in
`constants/theme.ts`. Do not introduce arbitrary spacing values outside this
scale.

## Motion

- Maximum duration: `200ms`
- Easing: `ease-out`
- Respect `prefers-reduced-motion`; all transitions are disabled for users
  who request reduced motion (see `app/globals.css`).

## Visual Rules

The interface is intentionally flat:

- No shadows
- No gradients
- No glassmorphism
- No neon or saturated accent colors
- No dashboard-style widgets, charts, or badges

## Layout Principles

- Generous whitespace over dense information.
- Typography carries hierarchy; avoid relying on color or borders to
  establish importance.
- Center content within a comfortable reading measure on wide screens rather
  than stretching it edge to edge.
