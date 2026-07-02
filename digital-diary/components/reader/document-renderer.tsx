import { DocumentBlock } from "@/types/models/diary-page";

interface DocumentRendererProps {
  blocks: DocumentBlock[];
}

export function DocumentRenderer({ blocks }: DocumentRendererProps) {
  if (!blocks || blocks.length === 0) {
    return (
      <p className="text-sm italic text-foreground/40 leading-relaxed">
        This page has no content.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-6 text-left leading-relaxed">
      {blocks.map((block) => {
        switch (block.type) {
          case "heading": {
            const level = block.props?.level || 1;
            if (level === 1) {
              return (
                <h3 key={block.id} className="font-heading text-2xl font-light text-foreground tracking-wide mt-4">
                  {block.content}
                </h3>
              );
            }
            if (level === 2) {
              return (
                <h4 key={block.id} className="font-heading text-xl font-light text-foreground tracking-wide mt-3">
                  {block.content}
                </h4>
              );
            }
            return (
              <h5 key={block.id} className="font-heading text-lg font-light text-foreground tracking-wide mt-2">
                {block.content}
              </h5>
            );
          }

          case "paragraph":
            return (
              <p key={block.id} className="text-sm font-normal text-foreground/80 leading-relaxed tracking-normal whitespace-pre-wrap">
                {block.content}
              </p>
            );

          case "image":
            if (!block.content) return null;
            return (
              <div key={block.id} className="w-full overflow-hidden rounded-sm border border-border bg-foreground/[0.01] flex justify-center py-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={block.content}
                  alt="Diary entry attachment"
                  className="max-h-[500px] w-auto object-contain rounded-sm transition-opacity duration-200"
                  loading="lazy"
                />
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
