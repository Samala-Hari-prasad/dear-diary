import { BookOpen } from "lucide-react";

export function Sidebar() {
  return (
    <aside className="hidden w-56 shrink-0 border-r border-border px-6 py-8 md:block">
      <nav aria-label="Primary">
        <ul className="flex flex-col gap-3">
          <li>
            <span className="flex items-center gap-3 rounded-sm px-3 py-2 text-sm text-foreground">
              <BookOpen size={16} strokeWidth={1.5} aria-hidden="true" />
              Entries
            </span>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
