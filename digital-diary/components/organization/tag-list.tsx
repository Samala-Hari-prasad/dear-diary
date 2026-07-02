"use client";

import { Tag } from "lucide-react";

interface TagListProps {
  tags: string[];
  selectedTag: string | null;
  onSelectTag: (tag: string | null) => void;
}

export function TagList({ tags, selectedTag, onSelectTag }: TagListProps) {
  if (tags.length === 0) {
    return (
      <div className="px-3 py-4 text-center text-[10px] text-foreground/35 select-none">
        No tags found.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="flex items-center gap-3 rounded-sm px-3 py-1.5 text-xs text-foreground/45 font-medium select-none uppercase tracking-wider">
        <Tag size={12} strokeWidth={2} />
        Tags
      </span>
      <div className="flex flex-wrap gap-1.5 pl-3 pr-2">
        {tags.map((tag) => {
          const isSelected = selectedTag === tag;
          return (
            <button
              key={tag}
              type="button"
              onClick={() => onSelectTag(isSelected ? null : tag)}
              className={`rounded-full px-2.5 py-0.5 text-[10px] font-normal transition-all duration-150 border ${
                isSelected
                  ? "bg-foreground text-background border-foreground"
                  : "bg-foreground/[0.01] text-foreground/60 border-border hover:border-foreground/30 hover:text-foreground"
              }`}
            >
              #{tag}
            </button>
          );
        })}
      </div>
    </div>
  );
}
