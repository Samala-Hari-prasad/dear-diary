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
import { useAuthStatus } from "@/hooks/use-auth-status";
import { LoginButton } from "@/components/auth/LoginButton";
import { apiClient } from "@/lib/api/client";

export default function Home() {
  const { authenticated, loading: authLoading, networkError } = useAuthStatus();
  const [pages, setPages] = useState<DiaryPageSummary[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string | undefined>(undefined);
  const [selectedPage, setSelectedPage] = useState<DiaryPage | null>(null);
  const [loadingIndex, setLoadingIndex] = useState(true);
  const [loadingPage, setLoadingPage] = useState(false);

  // Fetch page summaries
  const fetchIndex = async () => {
    setLoadingIndex(true);
    try {
      const result = await apiClient<any>("/api/v1/diary/pages");
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
      const result = await apiClient<any>(`/api/v1/diary/pages/${slug}`);
      if (result.success && result.data) {
        setSelectedPage(result.data);
      }
    } catch {
      setSelectedPage(null);
    } finally {
      setLoadingPage(false);
    }
  };

  const handleNewMemory = () => {
    const draftId = "draft-" + Date.now();
    const draftSlug = "new-memory-" + Date.now();
    const newPage: DiaryPage = {
      summary: {
        id: draftId,
        slug: draftSlug,
        title: "Untitled Memory",
        cover: null,
        date: new Date().toISOString().slice(0, 10), // Will use today() helper in Slice 2
        updatedAt: new Date().toISOString(),
        tags: [],
      },
      blocks: [
        {
          id: "initial-block",
          type: "paragraph",
          content: "Begin writing...",
        },
      ],
    };

    // Prepend draft summary to lists so it shows up in sidebar
    const draftSummary: DiaryPageSummary = {
      id: draftId,
      slug: draftSlug,
      title: "Untitled Memory",
      cover: null,
      date: new Date().toISOString().slice(0, 10), // Will use today() helper in Slice 2
      updatedAt: newPage.summary.updatedAt,
      tags: [],
    };

    setPages([draftSummary, ...pages]);
    setSelectedSlug(draftSlug);
    setSelectedPage(newPage);
  };

  const handlePageUpdate = (updatedPage: DiaryPage, oldSlug?: string) => {
    setSelectedPage(updatedPage);
    
    if (oldSlug && oldSlug !== updatedPage.summary.slug) {
      setSelectedSlug(updatedPage.summary.slug);
    }

    // Update summary in index list
    setPages(
      pages.map((p) => {
        const targetSlug = oldSlug || updatedPage.summary.slug;
        if (p.slug === targetSlug) {
          return {
            ...p,
            id: updatedPage.summary.id,
            slug: updatedPage.summary.slug,
            title: updatedPage.summary.title,
            tags: updatedPage.summary.tags,
            updatedAt: updatedPage.summary.updatedAt,
            favorite: updatedPage.summary.favorite,
            archived: updatedPage.summary.archived,
          };
        }
        return p;
      })
    );
  };

  useEffect(() => {
    if (authenticated) {
      fetchIndex();
    } else if (!authLoading) {
      setLoadingIndex(false);
    }
  }, [authenticated, authLoading]);

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
        {authLoading ? (
          <div className="w-full flex flex-col gap-6 animate-pulse text-left py-12">
            <div className="w-1/3 h-6 bg-foreground/10 rounded-sm" />
            <div className="w-full h-40 bg-foreground/5 rounded-sm border border-border" />
          </div>
        ) : networkError ? (
          <div className="flex flex-col items-center gap-12 pt-24 pb-12">
            <div className="flex flex-col gap-4 text-center">
              <h2 className="font-heading text-3xl font-light tracking-wide leading-tight md:text-4xl text-destructive">
                Unable to reach the server.
              </h2>
              <p className="text-muted-foreground">Please check your internet connection.</p>
            </div>
            <Button variant="ghost" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        ) : !authenticated ? (
          <div className="flex flex-col items-center gap-12 pt-24 pb-12">
            <div className="flex flex-col gap-4 text-center">
              <h2 className="font-heading text-3xl font-light tracking-wide leading-tight md:text-4xl">
                Sign in to view your diary.
              </h2>
            </div>
            <LoginButton />
          </div>
        ) : loadingIndex ? (
          <div className="w-full flex flex-col gap-6 animate-pulse text-left py-12">
            <div className="w-1/3 h-6 bg-foreground/10 rounded-sm" />
            <div className="w-full h-40 bg-foreground/5 rounded-sm border border-border" />
          </div>
        ) : pages.length === 0 ? (
          <div className="flex flex-col items-center gap-12">
            <Button type="button" onClick={handleNewMemory}>
              <Plus size={16} strokeWidth={1.5} aria-hidden="true" />
              {NEW_MEMORY_LABEL}
            </Button>
            <EmptyState type="empty-repo" />
          </div>
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
          <PageView page={selectedPage} onPageUpdate={handlePageUpdate} />
        ) : (
          <div className="flex flex-col items-center gap-12">
            {/* Tagline section if no selected page */}
            <div className="flex flex-col gap-4 text-center">
              <h2 className="font-heading text-3xl font-light tracking-wide leading-tight md:text-4xl">
                Every memory deserves a place.
              </h2>
            </div>
            <Button type="button" onClick={handleNewMemory}>
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
