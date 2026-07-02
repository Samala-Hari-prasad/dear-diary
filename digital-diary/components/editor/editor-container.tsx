"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { EditorSession } from "@/types/models/editor-document";
import { EditorHeader } from "./editor-header";
import { EditorStatus, SyncStatus } from "./editor-status";
import { EditorAdapter } from "@/lib/editor/adapter";
import { debounce } from "@/lib/editor/debounce";
import { SyncQueue, SyncTask } from "@/lib/editor/sync-queue";

// Dynamic import of BlockNote canvas to prevent SSR hydration errors
const MemoryEditorCanvas = dynamic(() => import("./memory-editor"), {
  ssr: false,
  loading: () => (
    <div className="w-full flex flex-col gap-3 animate-pulse text-left py-6 select-none max-w-[720px] mx-auto animate-pulse">
      <div className="w-full h-4 bg-foreground/10 rounded-sm" />
      <div className="w-5/6 h-4 bg-foreground/10 rounded-sm" />
      <div className="w-4/5 h-4 bg-foreground/10 rounded-sm" />
    </div>
  ),
});

interface EditorContainerProps {
  session: EditorSession;
  onChange: (updatedSession: EditorSession) => void;
  onSaveSuccess?: (slug: string) => void;
}

export function EditorContainer({ session, onChange, onSaveSuccess }: EditorContainerProps) {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("idle");
  const [queue] = useState(() => new SyncQueue());
  const [taskVersion, setTaskVersion] = useState(0);

  // Keep latest session in ref to avoid recreating the debounced handler
  const latestSessionRef = useRef(session);
  useEffect(() => {
    latestSessionRef.current = session;
  }, [session]);

  const triggerSync = useMemo(() => {
    return debounce(() => {
      const sessionToSync = latestSessionRef.current;
      if (!sessionToSync.isDirty) return;

      setTaskVersion((prev) => {
        const nextVersion = prev + 1;
        const task: SyncTask = {
          id: `sync-${sessionToSync.pageId || "draft"}-${nextVersion}`,
          version: nextVersion,
          execute: async () => {
            setSyncStatus("syncing");
            try {
              const res = await fetch("/api/v1/diary/pages/save", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ session: sessionToSync }),
              });

              if (res.status === 409) {
                setSaveStatusConflict();
                return;
              }

              const result = await res.json();
              if (result.success && result.data) {
                onChange({
                  ...sessionToSync,
                  pageId: result.data.slug,
                  sha: result.data.sha,
                  isDirty: false,
                  updatedAt: result.data.updatedAt,
                });
                setSyncStatus("synced");

                if (onSaveSuccess) {
                  onSaveSuccess(result.data.slug);
                }
              } else {
                setSyncStatus("idle");
              }
            } catch {
              setSyncStatus("idle");
            }
          },
        };

        queue.enqueue(task);
        return nextVersion;
      });
    }, 3000);
  }, [queue, onChange, onSaveSuccess]);

  // Clean up debounce timer on unmount
  useEffect(() => {
    return () => {
      triggerSync.cancel();
    };
  }, [triggerSync]);

  const setSaveStatusConflict = () => {
    setSyncStatus("conflict");
  };

  const handleSessionChange = (updatedSession: EditorSession) => {
    if (syncStatus === "conflict") {
      // Conflicts freeze synchronization but preserve local text entry
      onChange(updatedSession);
      return;
    }

    onChange(updatedSession);
    setSyncStatus("pending");
    triggerSync();
  };

  const handleTitleChange = (newTitle: string) => {
    handleSessionChange({
      ...session,
      title: newTitle,
      isDirty: true,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleTagsChange = (newTags: string[]) => {
    handleSessionChange({
      ...session,
      tags: newTags,
      isDirty: true,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleContentChange = (blocks: any[]) => {
    const internalBlocks = EditorAdapter.toStorageModel(blocks);
    handleSessionChange({
      ...session,
      content: internalBlocks,
      isDirty: true,
      updatedAt: new Date().toISOString(),
    });
  };

  const editorBlocks = EditorAdapter.toEditorModel(session.content);

  return (
    <div className="w-full flex flex-col gap-2">
      {/* Passive Status Header indicator for visual feedback */}
      <div className="flex justify-between items-center pb-4 mb-2 select-none border-b border-border/40">
        <span className="text-[10px] text-foreground/45 uppercase tracking-wider">Editor Session</span>
        {syncStatus === "syncing" && (
          <span className="text-[10px] text-accent/60 uppercase tracking-wider animate-pulse">Syncing changes...</span>
        )}
      </div>

      {/* Editor Header */}
      <EditorHeader
        title={session.title}
        createdAt={session.createdAt}
        tags={session.tags}
        onTitleChange={handleTitleChange}
        onTagsChange={handleTagsChange}
        mode={session.mode}
      />

      {/* Editor Core */}
      <div className="py-2">
        <MemoryEditorCanvas
          initialContent={editorBlocks}
          onChange={handleContentChange}
          editable={session.mode === "edit"}
        />
      </div>

      {/* Editor Status */}
      <EditorStatus status={syncStatus} mode={session.mode} />
    </div>
  );
}
