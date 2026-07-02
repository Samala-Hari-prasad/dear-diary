# Component Library Specification

This document defines the presentational and layout components in **The Digital Diary** application, specifying properties, behaviors, and accessibility requirements.

---

## 1. Visual & Layout Foundations

### `Button` (components/ui/button.tsx)
Standard interactive trigger.
- **Props**:
  - `variant`: `"primary" | "ghost"` (default: `"primary"`)
  - `size`: `"sm" | "md" | "lg"` (default: `"md"`)
  - Standard HTML button attributes.
- **Accessibility**: Includes focus rings and standard button roles.

### `ThemeToggle` (components/ui/theme-toggle.tsx)
Visual theme controller.
- **Props**: None
- **States**: `light` | `dark` | `system`
- **Accessibility**: Standard ARIA role `group` with pressing states.

---

## 2. Navigation Shelf

### `Sidebar` (components/layout/sidebar.tsx)
The primary navigation container housing search and calendar panels.
- **Props**:
  - `pages`: `DiaryPageSummary[]`
  - `selectedSlug`: `string`
  - `onSelect`: `(slug: string) => void`
- **Subcomponents**: `<SearchBar />`, `<CalendarView />`, `<PageList />`
- **Accessibility**: Semantic HTML `<aside>` and ARIA role `navigation`.

---

## 3. Search Engine

### `SearchBar` (components/search/search-bar.tsx)
Input field for keyword query filtering.
- **Props**:
  - `value`: `string`
  - `onChange`: `(value: string) => void`
- **Accessibility**: Descriptive labels and clear buttons.

---

## 4. Calendar Timeline

### `CalendarView` (components/calendar/calendar-view.tsx)
Monthly chronological grid layout.
- **Props**:
  - `pages`: `DiaryPageSummary[]`
  - `selectedDate`: `string | null`
  - `onSelectDate`: `(date: string | null) => void`
- **Accessibility**: Interactive date cells with calendar grid layouts.
- **Visuals**: quiet bottom-center dots indicating entries.
