import "server-only";
import { DiaryPageSummary } from "@/types/models/diary-summary";
import { RepositoryService } from "@/lib/github/repository";
import { queryIndex } from "./query";

export interface SearchOptions {
  query: string;
  limit?: number;
  includeTitle?: boolean;
  includeSlug?: boolean;
  includeTags?: boolean;
}

export async function searchRepository(
  options: SearchOptions
): Promise<DiaryPageSummary[]> {
  const pages = await RepositoryService.getPagesIndex();
  const filtered = queryIndex(pages, options.query);

  if (options.limit !== undefined) {
    return filtered.slice(0, options.limit);
  }

  return filtered;
}
