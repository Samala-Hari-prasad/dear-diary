// Design tokens for The Digital Diary.
// These values mirror the CSS custom properties defined in app/globals.css
// and exist here so components can reference them in a type-safe way.

export const FONTS = {
  heading: "var(--font-heading)",
  body: "var(--font-body)",
} as const;

export const SPACING = {
  xs: "4px",
  sm: "8px",
  md: "12px",
  lg: "16px",
  xl: "24px",
  "2xl": "32px",
  "3xl": "48px",
  "4xl": "64px",
} as const;

export const MOTION = {
  duration: "200ms",
  easing: "ease-out",
} as const;

export const LIGHT_THEME = {
  background: "#FAF9F6",
  foreground: "#1C1B1A",
  accent: "#4A574E",
  border: "#E8E7E3",
} as const;

export const DARK_THEME = {
  background: "#141413",
  foreground: "#E5E4E0",
  accent: "#8FA499",
  border: "#2C2B29",
} as const;
