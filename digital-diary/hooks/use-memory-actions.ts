import { useState } from "react";
import { memoryEvents } from "@/lib/client/events";
import { openOrCreateMemory, deleteMemoryApi, changeDateApi } from "@/lib/client/memory-client";
import { DiaryPageSummary } from "@/types/models/diary-summary";

export function useMemoryActions() {
  const [isLoading, setIsLoading] = useState(false);

  const create = async (date: string) => {
    setIsLoading(true);
    try {
      const result = await openOrCreateMemory(date);
      memoryEvents.emit("memory:opened", { slug: result.slug });
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const open = (slug: string) => {
    memoryEvents.emit("memory:opened", { slug });
  };

  const rename = async (summary: DiaryPageSummary, newTitle: string) => {
    // Emits an optimistic update. The actual save is handled by the editor's debounced sync queue
    // because the prompt says "Use existing save pipeline."
    const updated = { ...summary, title: newTitle, updatedAt: new Date().toISOString() };
    memoryEvents.emit("memory:updated", { summary: updated });
  };

  const deleteAction = async (summary: DiaryPageSummary) => {
    // 1. Optimistically delete from UI
    memoryEvents.emit("memory:deleted", { slug: summary.slug });
    
    try {
      // 2. Actually delete (moves to trash on backend, implemented in Slice 3)
      await deleteMemoryApi(summary.slug);
      
      // 3. TODO: Show Toast with Undo button (Slice 3)
      // If Undo clicked -> call restore()
    } catch (err) {
      // 4. Rollback on failure
      memoryEvents.emit("memory:restored", { summary });
      throw err;
    }
  };

  const restore = async (summary: DiaryPageSummary) => {
    // Optimistic restore
    memoryEvents.emit("memory:restored", { summary });
    // TODO: Call restore API (Slice 3)
  };

  const duplicate = async (summary: DiaryPageSummary, newDate: string) => {
    // TODO: Call duplicate API and emit events (Slice 3)
    console.log("Duplicate not yet implemented", summary, newDate);
  };

  const changeDate = async (summary: DiaryPageSummary, newDate: string) => {
    const oldDate = summary.date || summary.updatedAt.slice(0, 10);
    // Optimistic update
    memoryEvents.emit("memory:dateChanged", { slug: summary.slug, oldDate, newDate });
    try {
      await changeDateApi(summary.slug, newDate);
    } catch (err) {
      // Rollback on failure (e.g. 409 DATE_CONFLICT)
      memoryEvents.emit("memory:dateChanged", { slug: summary.slug, oldDate: newDate, newDate: oldDate });
      throw err;
    }
  };

  return {
    isLoading,
    create,
    open,
    rename,
    delete: deleteAction,
    restore,
    duplicate,
    changeDate,
  };
}
