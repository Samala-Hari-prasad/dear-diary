"use client";

import { useEffect, useState } from "react";
import { Edit2, Eye } from "lucide-react";
import { DiaryPage } from "@/types/models/diary-page";
import { DocumentRenderer } from "./document-renderer";
import { EditorContainer } from "@/components/editor/editor-container";
import { EditorSession } from "@/types/models/editor-document";
import { Button } from "@/components/ui/button";

interface PageViewProps {
  page: DiaryPage;
  onPageUpdate?: (updatedPage: DiaryPage) => void;
}

export function PageView({ page, onPageUpdate }: PageViewProps) {
  const [mode, setMode] = useState<"read" | "edit">("read");
  const [session, setSession] = useState<EditorSession | null>(null);

  // Sync session state when page changes
  useEffect(() => {
    setSession({
      pageId: page.summary.id,
      title: page.summary.title,
      tags: page.summary.tags,
      content: page.blocks,
      isDirty: false,
      mode: "read",
      createdAt: page.summary.updatedAt,
      updatedAt: page.summary.updatedAt,
    });
    setMode("read");
  }, [page]);

  const handleToggleMode = () => {
    if (mode === "read") {
      setMode("edit");
      if (session) {
        setSession({ ...session, mode: "edit" });
      }
    } else {
      setMode("read");
      if (session) {
        setSession({ ...session, mode: "read" });
        // Notify parent of local change state (for sidebar/metadata sync in v0.4.0)
        if (onPageUpdate) {
          onPageUpdate({
            summary: {
              id: session.pageId || page.summary.id,
              slug: page.summary.slug,
              title: session.title,
              cover: page.summary.cover,
              updatedAt: session.updatedAt,
              tags: session.tags,
            },
            blocks: session.content,
          });
        }
      }
    }
  };

  const formattedDate = new Date(page.summary.updatedAt).toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

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
          onChange={setSession}
          onSaveSuccess={(newSlug) => {
            if (onPageUpdate) {
              onPageUpdate({
                summary: {
                  id: newSlug,
                  slug: newSlug,
                  title: session.title,
                  cover: page.summary.cover,
                  updatedAt: session.updatedAt,
                  tags: session.tags,
                },
                blocks: session.content,
                sha: session.sha,
              });
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
              <time dateTime={page.summary.updatedAt}>{formattedDate}</time>
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
