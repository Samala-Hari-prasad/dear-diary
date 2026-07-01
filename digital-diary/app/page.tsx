"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Sidebar } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/reader/empty-state";
import { PageView } from "@/components/reader/page-view";
import { RepositoryStatus } from "@/components/status/repository-status";
import { DiaryPageSummary } from "@/types/models/diary-summary";
import { DiaryPage } from "@/types/models/diary-page";
import { NEW_MEMORY_LABEL } from "@/constants/app";

export default function Home() {
  const [pages, setPages] = useState<DiaryPageSummary[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string | undefined>(undefined);
  const [selectedPage, setSelectedPage] = useState<DiaryPage | null>(null);
  const [loadingIndex, setLoadingIndex] = useState(true);
  const [loadingPage, setLoadingPage] = useState(false);

  // Fetch page summaries
  const fetchIndex = async () => {
    setLoadingIndex(true);
    try {
      const res = await fetch("/api/v1/diary/pages");
      const result = await res.json();
      if (result.success && Array.isArray(result.data)) {
        setPages(result.data);
      }
    } catch {
      setPages([]);
    } finally {
      setLoadingIndex(false);
    }
  };

  // Fetch page content
  const fetchPage = async (slug: string) => {
    setLoadingPage(true);
    try {
      const res = await fetch(`/api/v1/diary/pages/${slug}`);
      const result = await res.json();
      if (result.success && result.data) {
        setSelectedPage(result.data);
      }
    } catch {
      setSelectedPage(null);
    } finally {
      setLoadingPage(false);
    }
  };

  useEffect(() => {
    fetchIndex();
  }, []);

  const handleSelectPage = (slug: string) => {
    setSelectedSlug(slug);
    fetchPage(slug);
  };

  return (
    <AppShell
      sidebar={
        <Sidebar
          pages={pages}
          selectedSlug={selectedSlug}
          onSelect={handleSelectPage}
        />
      }
    >
      <div className="flex flex-col gap-12 max-w-2xl mx-auto">
        {/* Main Content Area */}
        {loadingIndex ? (
          <div className="w-full flex flex-col gap-6 animate-pulse text-left py-12">
            <div className="w-1/3 h-6 bg-foreground/10 rounded-sm" />
            <div className="w-full h-40 bg-foreground/5 rounded-sm border border-border" />
          </div>
        ) : pages.length === 0 ? (
          <EmptyState type="empty-repo" />
        ) : loadingPage ? (
          <div className="w-full flex flex-col gap-6 animate-pulse text-left py-6">
            <div className="w-2/3 h-10 bg-foreground/10 rounded-sm" />
            <div className="w-1/3 h-4 bg-foreground/10 rounded-sm" />
            <div className="w-full h-48 bg-foreground/5 rounded-sm border border-border" />
            <div className="flex flex-col gap-3 mt-4">
              <div className="w-full h-4 bg-foreground/10 rounded-sm" />
              <div className="w-5/6 h-4 bg-foreground/10 rounded-sm" />
              <div className="w-4/5 h-4 bg-foreground/10 rounded-sm" />
            </div>
          </div>
        ) : selectedPage ? (
          <PageView page={selectedPage} />
        ) : (
          <div className="flex flex-col items-center gap-12">
            {/* Tagline section if no selected page */}
            <div className="flex flex-col gap-4 text-center">
              <h2 className="font-heading text-3xl font-light tracking-wide leading-tight md:text-4xl">
                Every memory deserves a place.
              </h2>
            </div>
            <Button type="button" disabled className="opacity-40 cursor-not-allowed">
              <Plus size={16} strokeWidth={1.5} aria-hidden="true" />
              {NEW_MEMORY_LABEL}
            </Button>
            <EmptyState type="no-selection" />
          </div>
        )}

        {/* Repository status section at bottom */}
        <div className="border-t border-border pt-12">
          <RepositoryStatus />
        </div>
      </div>
    </AppShell>
  );
}
