import { useState } from "react";
import { DiaryPageSummary } from "@/types/models/diary-summary";
import { ContextMenu, useContextMenuList } from "@/components/ui/context-menu";
import { useMemoryActions } from "@/hooks/use-memory-actions";
import { toast } from "@/hooks/use-toast";
import { MoreHorizontal, FolderOpen, Edit3, CalendarDays, Copy, Trash2 } from "lucide-react";

interface PageListProps {
  pages: DiaryPageSummary[];
  selectedSlug?: string;
  onSelect: (slug: string) => void;
}

export function PageList({ pages, selectedSlug, onSelect }: PageListProps) {
  const { isOpen, x, y, activeItem, handleContextMenu, handleActionClick, close } = useContextMenuList<DiaryPageSummary>();
  const actions = useMemoryActions();
  const [datePrompt, setDatePrompt] = useState<{ type: "duplicate" | "changeDate", summary: DiaryPageSummary } | null>(null);

  if (!pages || pages.length === 0) {
    return (
      <p className="text-xs text-foreground/45 italic px-3 leading-relaxed">
        No memories recorded yet.
      </p>
    );
  }

  const handleDatePromptSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const date = formData.get("date") as string;
    if (datePrompt && date) {
      const type = datePrompt.type;
      const summary = datePrompt.summary;
      setDatePrompt(null);
      
      try {
        if (type === "duplicate") {
          await actions.duplicate(summary, date);
        } else {
          await actions.changeDate(summary, date);
        }
      } catch (err: any) {
        toast({
          message: err.message || `Failed to ${type === "duplicate" ? "duplicate" : "change date"}`,
          duration: 3000,
        });
      }
    }
  };

  return (
    <>
      <ul className="flex flex-col gap-2">
        {pages.map((page) => {
          const isSelected = page.slug === selectedSlug;
          return (
            <li key={page.id} className="group relative">
              <button
                type="button"
                onClick={() => onSelect(page.slug)}
                onContextMenu={(e) => handleContextMenu(e, page)}
                aria-current={isSelected ? "page" : undefined}
                className={`w-full flex flex-col items-start gap-1 rounded-sm px-3 py-2 text-left transition-colors duration-200 ease-out ${
                  isSelected
                    ? "bg-accent text-background"
                    : "hover:bg-foreground/5 text-foreground"
                }`}
              >
                <div className="flex w-full items-start justify-between">
                  <span className="text-sm font-medium leading-snug tracking-wide line-clamp-1 pr-6">
                    {page.title}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => handleActionClick(e, page)}
                    className={`absolute right-2 top-2 p-1 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity focus-visible:opacity-100 ${
                      isSelected ? "text-background hover:bg-background/20" : "text-foreground/50 hover:bg-foreground/10 hover:text-foreground"
                    }`}
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
                <span
                  className={`text-[10px] tracking-wider uppercase ${
                    isSelected ? "text-background/70" : "text-foreground/40"
                  }`}
                >
                  {new Date(page.date || page.updatedAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <ContextMenu
        isOpen={isOpen}
        x={x}
        y={y}
        onClose={close}
        items={[
          { label: "Open", icon: <FolderOpen />, onClick: () => activeItem && onSelect(activeItem.slug) },
          { label: "Change Date", icon: <CalendarDays />, onClick: () => activeItem && setDatePrompt({ type: "changeDate", summary: activeItem }) },
          { label: "Duplicate", icon: <Copy />, onClick: () => activeItem && setDatePrompt({ type: "duplicate", summary: activeItem }) },
          { label: "-", onClick: () => {} },
          { label: "Delete", icon: <Trash2 />, destructive: true, onClick: () => activeItem && actions.delete(activeItem) },
        ]}
      />

      {datePrompt && (
        <div className="fixed inset-0 z-[200] bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form 
            onSubmit={handleDatePromptSubmit} 
            className="bg-background border border-border p-6 rounded-lg shadow-xl w-full max-w-sm flex flex-col gap-4 animate-in fade-in zoom-in-95"
          >
            <h3 className="font-medium text-lg">
              {datePrompt.type === "duplicate" ? "Duplicate Memory" : "Change Date"}
            </h3>
            <p className="text-sm text-foreground/70">
              {datePrompt.type === "duplicate" 
                ? `Choose a new date for "${datePrompt.summary.title}"` 
                : `Select a new date for "${datePrompt.summary.title}"`}
            </p>
            <input 
              type="date" 
              name="date" 
              required 
              defaultValue={datePrompt.summary.date || datePrompt.summary.updatedAt.slice(0, 10)}
              className="px-3 py-2 border border-border rounded-md bg-transparent focus:outline-none focus:border-foreground"
              autoFocus
            />
            <div className="flex justify-end gap-3 mt-2">
              <button 
                type="button" 
                onClick={() => setDatePrompt(null)}
                className="px-4 py-2 text-sm text-foreground/70 hover:text-foreground transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-4 py-2 text-sm bg-foreground text-background rounded-md hover:bg-foreground/90 transition-colors"
              >
                {datePrompt.type === "duplicate" ? "Duplicate" : "Save"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
