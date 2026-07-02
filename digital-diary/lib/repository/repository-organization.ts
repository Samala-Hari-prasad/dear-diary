import { DiaryPageSummary } from "@/types/models/diary-summary";

export function filterByTag(pages: DiaryPageSummary[], tag: string): DiaryPageSummary[] {
  return pages.filter((page) => page.tags.includes(tag));
}

export function getFavoritePages(pages: DiaryPageSummary[]): DiaryPageSummary[] {
  return pages.filter((page) => page.favorite === true);
}

export function getArchivedPages(pages: DiaryPageSummary[]): DiaryPageSummary[] {
  return pages.filter((page) => page.archived === true);
}

export function getActivePages(pages: DiaryPageSummary[]): DiaryPageSummary[] {
  // Exclude archived items from standard sidebar listings
  return pages.filter((page) => page.archived !== true);
}

export function getAllTags(pages: DiaryPageSummary[]): string[] {
  const tagsSet = new Set<string>();
  for (const page of pages) {
    if (page.tags) {
      for (const tag of page.tags) {
        tagsSet.add(tag);
      }
    }
  }
  return Array.from(tagsSet).sort();
}
