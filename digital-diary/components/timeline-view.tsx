import Link from "next/link";
import { format, parseISO } from "date-fns";

export interface TimelineItem {
  id: string;
  title: string;
  eventDate: string;
  snippet: string;
  updatedAt: string;
  readingTimeMin?: number;
}

export function TimelineView({ items }: { items: TimelineItem[] }) {
  // Validate and sort items by eventDate descending
  const validItems = items.filter(item => item && item.id && item.eventDate);
  const sortedItems = [...validItems].sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime());

  // Group by Month/Year
  const grouped = sortedItems.reduce((acc, item) => {
    try {
      const date = parseISO(item.eventDate);
      const monthYear = format(date, "MMMM yyyy");
      if (!acc[monthYear]) acc[monthYear] = [];
      acc[monthYear].push(item);
    } catch (e) {
      console.warn("Skipping item with invalid date:", item.eventDate);
    }
    return acc;
  }, {} as Record<string, TimelineItem[]>);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center px-4">
        <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mb-6 text-muted-foreground">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
        </div>
        <h3 className="text-xl font-semibold mb-2">No entries yet</h3>
        <p className="text-muted-foreground max-w-sm">
          Your timeline is empty. Press <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 mx-1">⌘K</kbd> to create your first memory.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-12 max-w-2xl mx-auto py-8 px-4">
      {Object.entries(grouped).map(([monthYear, monthItems]) => (
        <div key={monthYear} className="space-y-6 relative">
          <h2 className="text-xl font-bold tracking-tight text-foreground sticky top-0 bg-background/95 backdrop-blur-md py-3 z-10">
            {monthYear}
          </h2>
          <div className="space-y-2 relative before:absolute before:inset-y-0 before:left-[39px] before:w-[2px] before:bg-border/50">
            {monthItems.map(item => {
              const readingTime = item.readingTimeMin || 1;
              return (
                <Link 
                  href={`/entry/${item.id}`} 
                  key={item.id}
                  className="flex group relative py-3 items-start gap-6 hover:bg-muted/30 rounded-lg -ml-4 pl-4 pr-4 transition-colors"
                >
                  <div className="flex flex-col items-end min-w-[48px] shrink-0 pt-0.5">
                    <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                      {format(parseISO(item.eventDate), "MMM d")}
                    </span>
                  </div>
                  
                  {/* Timeline Dot */}
                  <div className="absolute left-[35px] top-[18px] w-2.5 h-2.5 rounded-full bg-border group-hover:bg-primary group-hover:scale-125 transition-all" />

                  <div className="flex flex-col gap-1 min-w-0">
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                      {item.title || "Untitled"}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{readingTime} min read</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
