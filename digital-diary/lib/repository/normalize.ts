import { DiaryPageSummary } from "@/types/models/diary-summary";
import { formatDateKey } from "@/lib/utils/date";

export interface RawDiaryPageSummary extends Omit<DiaryPageSummary, "date"> {
  date?: string;
}

export interface RawMetaIndex {
  pages: RawDiaryPageSummary[];
}

export interface MetaIndex {
  pages: DiaryPageSummary[];
}

export function normalizeMetaIndex(index: RawMetaIndex): MetaIndex {
  const normalizedPages = index.pages.map(page => {
    if (page.date) {
      return page as DiaryPageSummary;
    }
    
    // Derive date from updatedAt if missing (migration)
    return {
      ...page,
      date: formatDateKey(page.updatedAt)
    } as DiaryPageSummary;
  });

  return {
    ...index,
    pages: normalizedPages
  };
}
