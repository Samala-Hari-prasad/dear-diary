export interface DiaryPageSummary {
  id: string;
  slug: string;
  title: string;
  cover: string | null;
  date?: string; // ISO_LOCAL_DATE: YYYY-MM-DD
  updatedAt: string; // ISO String format
  tags: string[];
  favorite?: boolean;
  archived?: boolean;
}
