import { DiaryPageSummary } from "./diary-summary";

export interface CalendarSummary {
  date: string; // ISO Date string (YYYY-MM-DD)
  count: number;
  entries: DiaryPageSummary[];
}
