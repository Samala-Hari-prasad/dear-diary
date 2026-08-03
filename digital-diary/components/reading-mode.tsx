import { format, parseISO } from "date-fns";
import { MarkdownRenderer } from "./markdown-renderer";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";

interface ReadingModeProps {
  id: string;
  title: string;
  content: string;
  eventDate: string;
}

export function ReadingMode({ id, title, content, eventDate }: ReadingModeProps) {
  let dateDisplay = eventDate;
  try {
    dateDisplay = format(parseISO(eventDate), "EEEE, MMMM d, yyyy");
  } catch (e) {
    // fallback
  }

  return (
    <div className="flex flex-col h-full mx-auto w-full max-w-4xl relative overflow-y-auto bg-background reading-mode-container">
      <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/40">
        <div className="text-sm text-muted-foreground font-medium">{dateDisplay}</div>
        <div className="flex items-center gap-2">
          <Link 
            href={`/entry/${id}/edit`} 
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Pencil size={14} />
            Edit
          </Link>
        </div>
      </div>
      
      <div className="flex-1 p-8 sm:p-12 md:p-16">
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-foreground mb-8 tracking-tight" style={{ fontFamily: "Georgia, Charter, 'Times New Roman', serif" }}>
          {title}
        </h1>
        <div className="reading-mode-prose" style={{ fontFamily: "Georgia, Charter, 'Times New Roman', serif" }}>
          <MarkdownRenderer content={content} />
        </div>
      </div>
    </div>
  );
}
