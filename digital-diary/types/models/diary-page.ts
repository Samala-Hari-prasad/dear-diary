import { DiaryPageSummary } from "./diary-summary";

export interface DocumentBlock {
  id: string;
  type: "heading" | "paragraph" | "image";
  props?: {
    level?: number;
    [key: string]: any;
  };
  content?: string;
}

export interface DiaryPage {
  summary: DiaryPageSummary;
  blocks: DocumentBlock[];
}
