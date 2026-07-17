import "server-only";
import { EditorSession } from "@/types/models/editor-document";
import { loadMetaIndex } from "@/lib/github/index";
import { saveMemoryTransaction, deleteMemoryTransaction, changeDateTransaction } from "./transaction";

export interface MemoryResult {
  status: "created" | "opened";
  slug: string;
}

export class MemoryService {
  /**
   * Opens an existing memory for the given date or returns a draft slug.
   */
  async openOrCreate(date: string): Promise<MemoryResult> {
    const index = await loadMetaIndex();
    const existing = index.find((p) => p.date === date);

    if (existing) {
      return { status: "opened", slug: existing.slug };
    }

    // No memory exists for this date, so it's a creation flow.
    // The slug will be finalized during save.
    return { status: "created", slug: `new-memory-${Date.now()}` };
  }

  /**
   * Saves a memory via the repository layer.
   */
  async saveMemory(session: EditorSession): Promise<{ sha: string; slug: string; updatedAt: string }> {
    return await saveMemoryTransaction(session);
  }

  /**
   * Deletes a memory by slug.
   */
  async deleteMemory(slug: string): Promise<void> {
    return await deleteMemoryTransaction(slug);
  }

  /**
   * Changes the date of a memory.
   */
  async changeDate(slug: string, newDate: string): Promise<void> {
    return await changeDateTransaction(slug, newDate);
  }

  /**
   * Restores a memory from the trash.
   */
  async restoreMemory(slug: string): Promise<void> {
    const { restoreMemoryTransaction } = await import("./transaction");
    return await restoreMemoryTransaction(slug);
  }

  /**
   * Duplicates a memory to a new date.
   */
  async duplicateMemory(slug: string, newDate: string): Promise<{ newSlug: string }> {
    const { duplicateMemoryTransaction } = await import("./transaction");
    return await duplicateMemoryTransaction(slug, newDate);
  }
}

export const memoryService = new MemoryService();
