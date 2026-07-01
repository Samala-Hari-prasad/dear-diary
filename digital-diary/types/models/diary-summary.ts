export interface DiaryPageSummary {
  id: string;
  slug: string;
  title: string;
  cover: string | null;
  updatedAt: string; // ISO String format
  tags: string[];
}
