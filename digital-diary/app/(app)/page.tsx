import { getDiscoveryItems } from "@/lib/github/storage";
import { TimelineView } from "@/components/timeline-view";
import { CalendarView } from "@/components/calendar-view";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default async function AppHome(props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const searchParams = await props.searchParams;
  const tab = typeof searchParams.tab === 'string' ? searchParams.tab : 'timeline';
  
  let items: Awaited<ReturnType<typeof getDiscoveryItems>> = [];
  let error = null;
  try {
    items = await getDiscoveryItems();
  } catch (e: unknown) {
    if (e instanceof Error) {
      error = e.message || "Failed to load memory index.";
    } else {
      error = "Failed to load memory index.";
    }
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur border-b border-border p-4">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-xl font-bold tracking-tight">Memory Dashboard</h1>
          <div className="flex items-center gap-1 bg-muted p-1 rounded-lg overflow-x-auto">
            <Link 
              href="/?tab=timeline"
              className={cn("px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap", tab === 'timeline' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground')}
            >
              Timeline
            </Link>
            <Link 
              href="/?tab=calendar"
              className={cn("px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap", tab === 'calendar' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground')}
            >
              Calendar
            </Link>
          </div>
        </div>
      </div>

      <div className="flex-1">
        {error ? (
          <div className="flex flex-col items-center justify-center py-32 text-center px-4">
            <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">GitHub API Unreachable</h3>
            <p className="text-muted-foreground max-w-sm mb-6">
              {error.includes("429") ? "Rate limit exceeded. Please wait a moment before refreshing." : "We couldn't reach GitHub to load your memories. Check your internet connection or try again."}
            </p>
            <Link 
              href="/" 
              className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium text-sm hover:bg-primary/90 transition-colors inline-block"
            >
              Retry
            </Link>
          </div>
        ) : (
          <>
            {tab === 'timeline' && <TimelineView items={items} />}
            {tab === 'calendar' && <CalendarView items={items} />}
          </>
        )}
      </div>
    </div>
  );
}
