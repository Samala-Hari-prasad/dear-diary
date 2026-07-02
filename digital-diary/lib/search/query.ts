import { DiaryPageSummary } from "@/types/models/diary-summary";
import { tokenize } from "./tokenizer";

export function queryIndex(
  pages: DiaryPageSummary[],
  queryString: string
): DiaryPageSummary[] {
  const tokens = tokenize(queryString);
  if (tokens.length === 0) {
    return pages;
  }

  const scored = pages
    .map((page) => {
      let score = 0;
      const titleLower = (page.title || "").toLowerCase();
      const slugLower = (page.slug || "").toLowerCase();
      const tagsLower = (page.tags || []).map((t) => t.toLowerCase());

      const queryLower = queryString.toLowerCase().trim();
      
      // 1. Title exact match
      if (titleLower === queryLower) {
        score += 100;
      }

      for (const token of tokens) {
        // 2. Title startsWith
        if (titleLower.startsWith(token)) {
          score += 50;
        }
        
        // 3. Slug startsWith
        if (slugLower.startsWith(token)) {
          score += 40;
        }

        // 4. Tag match
        const matchingTags = tagsLower.filter(
          (tag) => tag === token || tag.includes(token)
        );
        score += matchingTags.length * 30;

        // 5. Partial title match
        if (titleLower.includes(token) && !titleLower.startsWith(token)) {
          score += 20;
        }

        // 6. Partial slug match
        if (slugLower.includes(token) && !slugLower.startsWith(token)) {
          score += 10;
        }
      }

      return { page, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.map((item) => item.page);
}
