import { DiaryPageSummary } from "@/types/models/diary-summary";

interface PageListProps {
  pages: DiaryPageSummary[];
  selectedSlug?: string;
  onSelect: (slug: string) => void;
}

export function PageList({ pages, selectedSlug, onSelect }: PageListProps) {
  if (!pages || pages.length === 0) {
    return (
      <p className="text-xs text-foreground/45 italic px-3 leading-relaxed">
        No memories recorded yet.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {pages.map((page) => {
        const isSelected = page.slug === selectedSlug;
        return (
          <li key={page.id}>
            <button
              type="button"
              onClick={() => onSelect(page.slug)}
              className={`w-full flex flex-col items-start gap-1 rounded-sm px-3 py-2 text-left transition-colors duration-200 ease-out ${
                isSelected
                  ? "bg-accent text-background"
                  : "hover:bg-foreground/5 text-foreground"
              }`}
            >
              <span className="text-sm font-medium leading-snug tracking-wide line-clamp-1">
                {page.title}
              </span>
              <span
                className={`text-[10px] tracking-wider uppercase ${
                  isSelected ? "text-background/70" : "text-foreground/40"
                }`}
              >
                {new Date(page.updatedAt).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
