// Application-level constants for The Digital Diary.

export const APP_NAME = "The Digital Diary";

export const APP_TAGLINE = "Every memory deserves a place.";

export const APP_DESCRIPTION =
  "A private, minimalist digital diary for keeping memories.";

export const EMPTY_STATE_TITLE = "There are no memories yet.";

export const EMPTY_STATE_SUBTITLE = "When you're ready, begin your first page.";

export const NEW_MEMORY_LABEL = "New Memory";

export function getGreeting(date: Date = new Date()): string {
  const hour = date.getHours();

  if (hour < 12) {
    return "Good Morning";
  }

  if (hour < 18) {
    return "Good Afternoon";
  }

  return "Good Evening";
}
