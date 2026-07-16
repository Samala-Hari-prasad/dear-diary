export function isValidDate(date: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(date);
}

/**
 * Returns a YYYY-MM-DD string for a Date object or a date string.
 * If a string is provided, it is parsed as a Date.
 */
export function formatDateKey(value: Date | string): string {
  const date = typeof value === 'string' ? new Date(value) : value;
  // Ensure we get UTC date part to avoid timezone shifts
  const iso = date.toISOString();
  return iso.slice(0, 10);
}

/** Returns today's date in YYYY-MM-DD format (local date). */
export function today(): string {
  return formatDateKey(new Date());
}

/** Parses a local date string (YYYY-MM-DD) into a Date object at midnight. */
export function parseLocalDate(date: string): Date {
  // Construct a date at UTC midnight to avoid timezone offset issues
  return new Date(date + 'T00:00:00');
}
