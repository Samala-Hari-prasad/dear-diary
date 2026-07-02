"use client";

import { CalendarDays } from "lucide-react";

export type TimeRangeFilter = "all" | "today" | "week" | "month";

interface QuickNavigationProps {
  activeFilter: TimeRangeFilter;
  onSelectFilter: (filter: TimeRangeFilter) => void;
}

export function QuickNavigation({ activeFilter, onSelectFilter }: QuickNavigationProps) {
  const options: { value: TimeRangeFilter; label: string }[] = [
    { value: "all", label: "All memories" },
    { value: "today", label: "Today" },
    { value: "week", label: "This week" },
    { value: "month", label: "This month" },
  ];

  return (
    <div className="flex flex-col gap-2">
      <span className="flex items-center gap-3 rounded-sm px-3 py-1.5 text-xs text-foreground/45 font-medium select-none uppercase tracking-wider">
        <CalendarDays size={12} strokeWidth={2} />
        Filter Timeline
      </span>
      <div className="flex flex-col gap-0.5 pl-1">
        {options.map(({ value, label }) => {
          const isActive = activeFilter === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => onSelectFilter(value)}
              className={`w-full text-left rounded-sm px-3 py-1.5 text-[11px] transition-all duration-150 ${
                isActive
                  ? "bg-foreground/5 text-foreground font-medium"
                  : "text-foreground/60 hover:bg-foreground/5 hover:text-foreground"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
