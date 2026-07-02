import "server-only";
import { CalendarSummary } from "@/types/models/calendar-summary";
import { RepositoryService } from "@/lib/github/repository";
import { groupPageSummariesByDay } from "./timeline";

export async function getCalendarIndex(): Promise<CalendarSummary[]> {
  const pages = await RepositoryService.getPagesIndex();
  const grouped = groupPageSummariesByDay(pages);

  return Object.keys(grouped)
    .map((date) => ({
      date,
      count: grouped[date].length,
      entries: grouped[date],
    }))
    .sort((a, b) => b.date.localeCompare(a.date));
}
