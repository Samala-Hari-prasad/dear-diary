import { DiaryPage } from "@/types/models/diary-page";
import { DocumentRenderer } from "./document-renderer";

interface PageViewProps {
  page: DiaryPage;
}

export function PageView({ page }: PageViewProps) {
  const { title, cover, updatedAt, tags } = page.summary;
  const formattedDate = new Date(updatedAt).toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="w-full flex flex-col gap-6 text-left">
      {/* Cover Image */}
      {cover && (
        <div className="w-full h-48 md:h-64 overflow-hidden rounded-sm border border-border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={cover}
            alt={`${title} cover`}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col gap-2 border-b border-border pb-4">
        <h2 className="font-heading text-3xl font-light tracking-wide text-foreground leading-tight md:text-4xl">
          {title}
        </h2>
        <div className="flex flex-wrap items-center gap-3 text-xs text-foreground/50 tracking-wide">
          <time dateTime={updatedAt}>{formattedDate}</time>
          {tags.length > 0 && (
            <>
              <span>•</span>
              <div className="flex gap-2">
                {tags.map((tag) => (
                  <span key={tag} className="bg-foreground/5 px-2 py-0.5 rounded-sm text-foreground/70">
                    #{tag}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Body Content */}
      <div className="py-2">
        <DocumentRenderer blocks={page.blocks} />
      </div>
    </article>
  );
}
