import { DocumentBlock } from "./diary-page";

export interface EditorSession {
  pageId: string | null;
  title: string;
  tags: string[];
  content: DocumentBlock[];
  isDirty: boolean;
  mode: "read" | "edit";
  createdAt: string;
  updatedAt: string;
  sha?: string;
}
