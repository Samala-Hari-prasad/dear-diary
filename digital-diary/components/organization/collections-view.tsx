"use client";

import { Folder, Heart, Archive } from "lucide-react";

export type CollectionFilter = "all" | "favorites" | "archive";

interface CollectionsViewProps {
  activeFilter: CollectionFilter;
  onSelectFilter: (filter: CollectionFilter) => void;
  favoritesCount: number;
  archiveCount: number;
}

export function CollectionsView({
  activeFilter,
  onSelectFilter,
  favoritesCount,
  archiveCount,
}: CollectionsViewProps) {
  const options = [
    { value: "all", label: "All memories", icon: Folder, count: null },
    { value: "favorites", label: "Favorites", icon: Heart, count: favoritesCount },
    { value: "archive", label: "Archive", icon: Archive, count: archiveCount },
  ] as const;

  return (
    <div className="flex flex-col gap-2">
      <span className="flex items-center gap-3 rounded-sm px-3 py-1.5 text-xs text-foreground/45 font-medium select-none uppercase tracking-wider">
        Collections
      </span>
      <div className="flex flex-col gap-0.5 pl-1">
        {options.map(({ value, label, icon: Icon, count }) => {
          const isActive = activeFilter === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => onSelectFilter(value)}
              className={`w-full flex items-center justify-between rounded-sm px-3 py-1.5 text-[11px] transition-all duration-150 ${
                isActive
                  ? "bg-foreground/5 text-foreground font-medium"
                  : "text-foreground/60 hover:bg-foreground/5 hover:text-foreground"
              }`}
            >
              <span className="flex items-center gap-2">
                <Icon size={12} strokeWidth={1.5} className={isActive ? "text-foreground" : "text-foreground/55"} />
                {label}
              </span>
              {count !== null && (
                <span className="text-[10px] text-foreground/35 font-normal">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
