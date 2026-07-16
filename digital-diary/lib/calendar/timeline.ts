import { DiaryPageSummary } from "@/types/models/diary-summary";

export function formatDateKey(dateStr: string | Date): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const day = d.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function filterToday(pages: DiaryPageSummary[]): DiaryPageSummary[] {
  const todayKey = formatDateKey(new Date());
  return pages.filter((page) => formatDateKey(page.date || page.updatedAt) === todayKey);
}

export function filterThisWeek(pages: DiaryPageSummary[]): DiaryPageSummary[] {
  const now = new Date();
  const day = now.getDay();
  // Calculate difference to Monday
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  
  const startOfWeek = new Date(now);
  startOfWeek.setDate(diff);
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 7);

  return pages.filter((page) => {
    const pageDate = new Date(page.date || page.updatedAt);
    return pageDate >= startOfWeek && pageDate < endOfWeek;
  });
}

export function filterThisMonth(pages: DiaryPageSummary[]): DiaryPageSummary[] {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  return pages.filter((page) => {
    const pageDate = new Date(page.date || page.updatedAt);
    return pageDate >= startOfMonth && pageDate < nextMonth;
  });
}

export function groupPageSummariesByDay(
  pages: DiaryPageSummary[]
): Record<string, DiaryPageSummary[]> {
  const groups: Record<string, DiaryPageSummary[]> = {};
  for (const page of pages) {
    const key = formatDateKey(page.date || page.updatedAt);
    if (!key) continue;
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(page);
  }
  return groups;
}
