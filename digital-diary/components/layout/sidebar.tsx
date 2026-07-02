"use client";

import { useState } from "react";
import { BookOpen } from "lucide-react";
import { DiaryPageSummary } from "@/types/models/diary-summary";
import { PageList } from "@/components/reader/page-list";
import { SearchBar } from "@/components/search/search-bar";
import { EmptySearch } from "@/components/search/empty-search";
import { queryIndex } from "@/lib/search/query";

// Calendar imports
import { CalendarView } from "@/components/calendar/calendar-view";
import { QuickNavigation, TimeRangeFilter } from "@/components/calendar/quick-navigation";
import {
  formatDateKey,
  filterToday,
  filterThisWeek,
  filterThisMonth,
} from "@/lib/calendar/timeline";

interface SidebarProps {
  pages?: DiaryPageSummary[];
  selectedSlug?: string;
  onSelect?: (slug: string) => void;
}

export function Sidebar({ pages = [], selectedSlug, onSelect = () => {} }: SidebarProps) {
  const [activeTab, setActiveTab] = useState<"search" | "calendar">("search");
  const [searchQuery, setSearchQuery] = useState("");

  // Calendar timeline states
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [timeFilter, setTimeFilter] = useState<TimeRangeFilter>("all");

  // Determine filtered list based on active mode
  let filteredPages = pages;

  if (activeTab === "search") {
    filteredPages = searchQuery.trim() !== "" 
      ? queryIndex(pages, searchQuery) 
      : pages;
  } else if (activeTab === "calendar") {
    if (selectedDate) {
      filteredPages = pages.filter((page) => formatDateKey(page.updatedAt) === selectedDate);
    } else {
      switch (timeFilter) {
        case "today":
          filteredPages = filterToday(pages);
          break;
        case "week":
          filteredPages = filterThisWeek(pages);
          break;
        case "month":
          filteredPages = filterThisMonth(pages);
          break;
        case "all":
        default:
          filteredPages = pages;
          break;
      }
    }
  }

  const handleSelectDate = (date: string | null) => {
    setSelectedDate(date);
    // Reset range filter when a specific date is chosen to prevent conflict
    if (date !== null) {
      setTimeFilter("all");
    }
  };

  const handleSelectTimeFilter = (filter: TimeRangeFilter) => {
    setTimeFilter(filter);
    // Reset specific date selection when a range filter is clicked
    setSelectedDate(null);
  };

  return (
    <aside className="hidden w-56 shrink-0 border-r border-border px-6 py-8 md:block overflow-y-auto max-h-[calc(100vh-64px)]">
      <nav aria-label="Primary" className="flex flex-col gap-6">
        {/* Navigation Tabs Header */}
        <div className="flex border-b border-border/60 pb-1 select-none">
          <button
            type="button"
            onClick={() => setActiveTab("search")}
            className={`flex-1 text-center pb-2 text-[11px] font-medium transition-all duration-200 border-b ${
              activeTab === "search"
                ? "border-foreground text-foreground"
                : "border-transparent text-foreground/40 hover:text-foreground/75"
            }`}
          >
            Search
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("calendar")}
            className={`flex-1 text-center pb-2 text-[11px] font-medium transition-all duration-200 border-b ${
              activeTab === "calendar"
                ? "border-foreground text-foreground"
                : "border-transparent text-foreground/40 hover:text-foreground/75"
            }`}
          >
            Calendar
          </button>
        </div>

        {/* Tab Panel contents */}
        {activeTab === "search" && (
          <div className="flex flex-col gap-6">
            <div className="px-1 select-none">
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
            </div>

            <div className="flex flex-col gap-3">
              <span className="flex items-center gap-3 rounded-sm px-3 py-2 text-sm text-foreground/60 font-medium select-none">
                <BookOpen size={16} strokeWidth={1.5} aria-hidden="true" />
                Memories
              </span>
              <div className="pl-1">
                {filteredPages.length === 0 ? (
                  <EmptySearch />
                ) : (
                  <PageList pages={filteredPages} selectedSlug={selectedSlug} onSelect={onSelect} />
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "calendar" && (
          <div className="flex flex-col gap-6">
            <div className="px-1">
              <CalendarView
                pages={pages}
                selectedDate={selectedDate}
                onSelectDate={handleSelectDate}
              />
            </div>

            <div className="px-1">
              <QuickNavigation
                activeFilter={timeFilter}
                onSelectFilter={handleSelectTimeFilter}
              />
            </div>

            <div className="flex flex-col gap-3 border-t border-border/40 pt-4">
              <span className="flex items-center gap-3 rounded-sm px-3 py-1 text-xs text-foreground/45 font-medium select-none uppercase tracking-wider">
                Results
              </span>
              <div className="pl-1">
                {filteredPages.length === 0 ? (
                  <EmptySearch />
                ) : (
                  <PageList pages={filteredPages} selectedSlug={selectedSlug} onSelect={onSelect} />
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </aside>
  );
}
