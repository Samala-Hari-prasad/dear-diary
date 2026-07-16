"use client";

import { useEffect, useState } from "react";
import { Edit2, Eye } from "lucide-react";
import { DiaryPage } from "@/types/models/diary-page";
import { DocumentRenderer } from "./document-renderer";
import { EditorContainer } from "@/components/editor/editor-container";
import { EditorSession } from "@/types/models/editor-document";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { changeDateApi } from "@/lib/client/memory-client";

interface PageViewProps {
  page: DiaryPage;
  onPageUpdate?: (updatedPage: DiaryPage, oldSlug?: string) => void;
}

export function PageView({ page, onPageUpdate }: PageViewProps) {
  const [mode, setMode] = useState<"read" | "edit">("read");
  const [session, setSession] = useState<EditorSession | null>(null);

  // Sync session state when page changes (only on initial load or SHA/ID change)
  useEffect(() => {
    setSession((prev) => {
      // If we are switching to a completely different page from the sidebar
      const isDifferentPage = !prev || (prev.pageId !== page.summary.id && !prev.pageId?.startsWith("draft-"));

      if (isDifferentPage) {
        setMode("read");
        return {
          pageId: page.summary.id,
          title: page.summary.title,
          tags: page.summary.tags,
          content: page.blocks,
          isDirty: false,
          mode: "read",
          createdAt: page.summary.updatedAt,
          updatedAt: page.summary.updatedAt,
          sha: page.sha,
          favorite: page.summary.favorite,
          archived: page.summary.archived,
        };
      }
      
      // Otherwise, just invisibly update the SHA and pageId if they were updated by a background save
      return {
        ...prev,
        sha: page.sha,
        pageId: page.summary.id,
      };
    });
  }, [page.summary.id, page.sha]);

  const handleSessionChange = (updatedSession: EditorSession) => {
    setSession(updatedSession);

    // Rule: Optimistic updates to title, tags, updatedAt. NEVER update sha optimistically.
    if (onPageUpdate) {
      onPageUpdate({
        summary: {
          id: updatedSession.pageId || page.summary.id,
          slug: page.summary.slug,
          title: updatedSession.title,
          cover: page.summary.cover,
          date: updatedSession.date || page.summary.date,
          updatedAt: updatedSession.updatedAt,
          tags: updatedSession.tags,
          favorite: updatedSession.favorite,
          archived: updatedSession.archived,
        },
        blocks: updatedSession.content,
        sha: page.sha, // Maintain loaded SHA for concurrency
      });
    }
  };

  const handleToggleMode = () => {
    if (mode === "read") {
      setMode("edit");
      if (session) {
        handleSessionChange({ ...session, mode: "edit" });
      }
    } else {
      setMode("read");
      if (session) {
        handleSessionChange({ ...session, mode: "read" });
      }
    }
  };

  const [isChangingDate, setIsChangingDate] = useState(false);

  const handleChangeDate = async (newDate: string) => {
    if (newDate === page.summary.date) return;
    setIsChangingDate(true);
    try {
      await changeDateApi(page.summary.slug, newDate);
      if (onPageUpdate) {
        onPageUpdate({
          summary: {
            ...page.summary,
            date: newDate,
          },
          blocks: page.blocks,
          sha: page.sha,
        });
      }
    } catch (err: any) {
      alert(err.message || "Failed to change date");
    } finally {
      setIsChangingDate(false);
    }
  };

  return (
    <article className="w-full flex flex-col gap-6 text-left">
      {/* Read/Edit Toggle Button */}
      <div className="flex justify-end select-none">
        <Button
          variant="ghost"
          onClick={handleToggleMode}
          className="flex items-center gap-2 text-xs tracking-wider"
          aria-label={mode === "read" ? "Switch to edit mode" : "Switch to read mode"}
        >
          {mode === "read" ? (
            <>
              <Edit2 size={13} strokeWidth={1.5} />
              <span>Edit</span>
            </>
          ) : (
            <>
              <Eye size={13} strokeWidth={1.5} />
              <span>Preview</span>
            </>
          )}
        </Button>
      </div>

      {mode === "edit" && session ? (
        <EditorContainer
          session={session}
          onChange={handleSessionChange}
          onSaveSuccess={(newSlug) => {
            const oldSlug = page.summary.slug;
            // Confirm the new SHA and slug on successful write transaction
            if (onPageUpdate) {
              onPageUpdate({
                summary: {
                  id: newSlug,
                  slug: newSlug,
                  title: session.title,
                  cover: page.summary.cover,
                  date: session.date || page.summary.date,
                  updatedAt: session.updatedAt,
                  tags: session.tags,
                  favorite: session.favorite,
                  archived: session.archived,
                },
                blocks: session.content,
                sha: session.sha,
              }, oldSlug);
            }
          }}
        />
      ) : (
        <>
          {/* Cover Image */}
          {page.summary.cover && (
            <div className="w-full h-48 md:h-64 overflow-hidden rounded-sm border border-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={page.summary.cover}
                alt={`${page.summary.title} cover`}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Page Header */}
          <div className="flex flex-col gap-2 border-b border-border pb-4">
            <h2 className="font-heading text-3xl font-light tracking-wide text-foreground leading-tight md:text-4xl">
              {session?.title || page.summary.title}
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-xs text-foreground/50 tracking-wide">
              <DatePicker 
                value={session?.date || page.summary.date}
                onChange={handleChangeDate}
                disabled={isChangingDate || mode === "edit"}
              />
              {(session?.tags || page.summary.tags).length > 0 && (
                <>
                  <span>•</span>
                  <div className="flex gap-2">
                    {(session?.tags || page.summary.tags).map((tag) => (
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
            <DocumentRenderer blocks={session?.content || page.blocks} />
          </div>
        </>
      )}
    </article>
  );
}
