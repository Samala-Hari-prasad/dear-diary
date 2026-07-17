import { useState } from "react";
import { memoryEvents } from "@/lib/client/events";
import { openOrCreateMemory, deleteMemoryApi, changeDateApi, restoreMemoryApi, duplicateMemoryApi } from "@/lib/client/memory-client";
import { DiaryPageSummary } from "@/types/models/diary-summary";
import { toast, dismissToast } from "@/hooks/use-toast";

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
    const updated = { ...summary, title: newTitle, updatedAt: new Date().toISOString() };
    memoryEvents.emit("memory:updated", { summary: updated });
  };

  const deleteAction = async (summary: DiaryPageSummary) => {
    memoryEvents.emit("memory:deleted", { slug: summary.slug });
    
    const toastId = toast({
      message: "Memory deleted.",
      action: {
        label: "Undo",
        onClick: () => restore(summary)
      },
      duration: 5000,
    });

    try {
      await deleteMemoryApi(summary.slug);
    } catch (err) {
      memoryEvents.emit("memory:restored", { summary });
      dismissToast(toastId);
      throw err;
    }
  };

  const restore = async (summary: DiaryPageSummary) => {
    memoryEvents.emit("memory:restored", { summary });
    try {
      await restoreMemoryApi(summary.slug);
    } catch (err) {
      memoryEvents.emit("memory:deleted", { slug: summary.slug });
      throw err;
    }
  };

  const duplicate = async (summary: DiaryPageSummary, newDate: string) => {
    const duplicatedSummary = { ...summary, slug: newDate, date: newDate, id: `mem-${Date.now()}` };
    memoryEvents.emit("memory:duplicated", { summary: duplicatedSummary });
    memoryEvents.emit("memory:opened", { slug: newDate });

    try {
      const result = await duplicateMemoryApi(summary.slug, newDate);
      if (result.newSlug !== newDate) {
        // Handle case where API slug differs from requested date (e.g., date conflicts handled differently later)
      }
    } catch (err) {
      memoryEvents.emit("memory:deleted", { slug: newDate });
      memoryEvents.emit("memory:opened", { slug: summary.slug }); // revert open
      throw err;
    }
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
