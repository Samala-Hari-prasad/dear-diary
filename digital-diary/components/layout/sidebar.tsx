import { BookOpen } from "lucide-react";
import { DiaryPageSummary } from "@/types/models/diary-summary";
import { PageList } from "@/components/reader/page-list";

interface SidebarProps {
  pages?: DiaryPageSummary[];
  selectedSlug?: string;
  onSelect?: (slug: string) => void;
}

export function Sidebar({ pages = [], selectedSlug, onSelect = () => {} }: SidebarProps) {
  return (
    <aside className="hidden w-56 shrink-0 border-r border-border px-6 py-8 md:block overflow-y-auto max-h-[calc(100vh-64px)]">
      <nav aria-label="Primary" className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <span className="flex items-center gap-3 rounded-sm px-3 py-2 text-sm text-foreground/60 font-medium">
            <BookOpen size={16} strokeWidth={1.5} aria-hidden="true" />
            Memories
          </span>
          <div className="pl-1">
            <PageList pages={pages} selectedSlug={selectedSlug} onSelect={onSelect} />
          </div>
        </div>
      </nav>
    </aside>
  );
}
