import { Inbox } from "lucide-react";

export function EmptySearch() {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-4 text-center gap-3 select-none">
      <Inbox size={24} strokeWidth={1.2} className="text-foreground/25" />
      <div className="flex flex-col gap-1">
        <h4 className="text-xs font-medium text-foreground/60">No results found</h4>
        <p className="text-[11px] text-foreground/35 max-w-[150px] leading-relaxed">
          We couldn&apos;t find any memories matching your query.
        </p>
      </div>
    </div>
  );
}
