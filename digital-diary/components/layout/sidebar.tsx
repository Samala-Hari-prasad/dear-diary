"use client";

import { useState } from "react";
import { openOrCreateMemory } from "@/lib/client/memory-client";
import { BookOpen, Plus } from "lucide-react";
import { DiaryPageSummary } from "@/types/models/diary-summary";
import { today } from "@/lib/utils/date";
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

// Organization imports
import { TagList } from "@/components/organization/tag-list";
import { CollectionsView, CollectionFilter } from "@/components/organization/collections-view";
import {
  filterByTag,
  getFavoritePages,
  getArchivedPages,
  getActivePages,
  getAllTags,
} from "@/lib/repository/repository-organization";

interface SidebarProps {
  pages?: DiaryPageSummary[];
  selectedSlug?: string;
  onSelect?: (slug: string) => void;
}

export function Sidebar({ pages = [], selectedSlug, onSelect = () => {} }: SidebarProps) {
  const [activeTab, setActiveTab] = useState<"search" | "collections" | "calendar">("search");
  const [searchQuery, setSearchQuery] = useState("");

  // Calendar timeline states
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [timeFilter, setTimeFilter] = useState<TimeRangeFilter>("all");

  // Organization states
  const [collectionFilter, setCollectionFilter] = useState<CollectionFilter>("all");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Standard listings exclude archived items
  const activePages = getActivePages(pages);

  // Determine filtered list based on active mode
  let filteredPages = activePages;

  if (activeTab === "search") {
    filteredPages = searchQuery.trim() !== "" 
      ? queryIndex(activePages, searchQuery) 
      : activePages;
  } else if (activeTab === "collections") {
    if (selectedTag) {
      filteredPages = filterByTag(pages, selectedTag);
    } else {
      switch (collectionFilter) {
        case "favorites":
          filteredPages = getFavoritePages(pages);
          break;
        case "archive":
          filteredPages = getArchivedPages(pages);
          break;
        case "all":
        default:
          filteredPages = activePages;
          break;
      }
    }
  } else if (activeTab === "calendar") {
    if (selectedDate) {
      filteredPages = activePages.filter((page) => formatDateKey(page.updatedAt) === selectedDate);
    } else {
      switch (timeFilter) {
        case "today":
          filteredPages = filterToday(activePages);
          break;
        case "week":
          filteredPages = filterThisWeek(activePages);
          break;
        case "month":
          filteredPages = filterThisMonth(activePages);
          break;
        case "all":
        default:
          filteredPages = activePages;
          break;
      }
    }
  }

  const handleSelectDate = async (date: string | null) => {
    setSelectedDate(date);
    if (date !== null) {
      setTimeFilter("all");
      
      const existing = pages.find((p) => (p.date || formatDateKey(p.updatedAt)) === date);
      if (existing) {
        onSelect(existing.slug);
      } else {
        try {
          const result = await openOrCreateMemory(date);
          onSelect(result.slug);
        } catch (err) {
          console.error("Failed to open or create memory", err);
        }
      }
    }
  };

  const handleSelectTimeFilter = (filter: TimeRangeFilter) => {
    setTimeFilter(filter);
    setSelectedDate(null);
  };

  const handleSelectCollection = (filter: CollectionFilter) => {
    setCollectionFilter(filter);
    setSelectedTag(null); // Reset tag when collection changes
  };

  const handleSelectTag = (tag: string | null) => {
    setSelectedTag(tag);
  };

  // Get dynamic tags list and counts
  const tagsList = getAllTags(pages);
  const favoritesCount = getFavoritePages(pages).length;
  const archiveCount = getArchivedPages(pages).length;

  const handleNewMemory = async () => {
    try {
      const result = await openOrCreateMemory(today());
      onSelect(result.slug);
    } catch (err) {
      console.error("Failed to create new memory", err);
    }
  };

  return (
    <aside className="hidden w-56 shrink-0 border-r border-border px-6 py-8 md:block overflow-y-auto max-h-[calc(100vh-64px)]">
      <nav aria-label="Primary" className="flex flex-col gap-6">
        <button
          type="button"
          onClick={handleNewMemory}
          className="flex w-full items-center justify-center gap-2 rounded bg-foreground py-2 text-sm font-medium text-background transition-all hover:bg-foreground/90 focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2 select-none shadow-sm"
        >
          <Plus size={16} />
          New Memory
        </button>

        {/* Navigation Tabs Header */}
        <div role="tablist" aria-label="Navigation modes" className="flex border-b border-border/60 pb-1 select-none">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "search"}
            aria-controls="panel-search"
            id="tab-search"
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
            role="tab"
            aria-selected={activeTab === "collections"}
            aria-controls="panel-collections"
            id="tab-collections"
            onClick={() => setActiveTab("collections")}
            className={`flex-1 text-center pb-2 text-[11px] font-medium transition-all duration-200 border-b ${
              activeTab === "collections"
                ? "border-foreground text-foreground"
                : "border-transparent text-foreground/40 hover:text-foreground/75"
            }`}
          >
            Organize
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "calendar"}
            aria-controls="panel-calendar"
            id="tab-calendar"
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
          <div id="panel-search" role="tabpanel" aria-labelledby="tab-search" className="flex flex-col gap-6">
            <div className="px-1 select-none">
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
            </div>

            <div className="flex flex-col gap-3">
              <span className="flex items-center gap-3 rounded-sm px-3 py-2 text-sm text-foreground/60 font-medium select-none">
                <BookOpen size={16} strokeWidth={1.5} aria-hidden="true" />
                {searchQuery.trim() === "" ? "Recent Memories" : "Search Results"}
              </span>
              <div className="pl-1">
                {filteredPages.length === 0 ? (
                  <EmptySearch />
                ) : (
                  <PageList 
                    pages={searchQuery.trim() === "" ? filteredPages.slice(0, 5) : filteredPages} 
                    selectedSlug={selectedSlug} 
                    onSelect={onSelect} 
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "collections" && (
          <div id="panel-collections" role="tabpanel" aria-labelledby="tab-collections" className="flex flex-col gap-6">
            <div className="px-1">
              <CollectionsView
                activeFilter={collectionFilter}
                onSelectFilter={handleSelectCollection}
                favoritesCount={favoritesCount}
                archiveCount={archiveCount}
              />
            </div>

            <div className="px-1">
              <TagList
                tags={tagsList}
                selectedTag={selectedTag}
                onSelectTag={handleSelectTag}
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

        {activeTab === "calendar" && (
          <div id="panel-calendar" role="tabpanel" aria-labelledby="tab-calendar" className="flex flex-col gap-6">
            <div className="px-1">
              <CalendarView
                pages={activePages}
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
