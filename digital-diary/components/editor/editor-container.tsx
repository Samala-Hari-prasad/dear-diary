"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { EditorSession } from "@/types/models/editor-document";
import { EditorHeader } from "./editor-header";
import { EditorStatus } from "./editor-status";
import { SaveButton, SaveState } from "./save-button";
import { EditorAdapter } from "@/lib/editor/adapter";

// Dynamic import of BlockNote canvas to prevent SSR hydration errors
const MemoryEditorCanvas = dynamic(() => import("./memory-editor"), {
  ssr: false,
  loading: () => (
    <div className="w-full flex flex-col gap-3 animate-pulse text-left py-6 select-none max-w-[720px] mx-auto">
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
  const [saveState, setSaveState] = useState<SaveState>("idle");

  const handleTitleChange = (newTitle: string) => {
    onChange({
      ...session,
      title: newTitle,
      isDirty: true,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleTagsChange = (newTags: string[]) => {
    onChange({
      ...session,
      tags: newTags,
      isDirty: true,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleContentChange = (blocks: any[]) => {
    const internalBlocks = EditorAdapter.toStorageModel(blocks);
    onChange({
      ...session,
      content: internalBlocks,
      isDirty: true,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleSave = async () => {
    setSaveState("saving");
    try {
      const res = await fetch("/api/v1/diary/pages/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ session }),
      });

      const result = await res.json();

      if (res.status === 409) {
        setSaveState("conflict");
        return;
      }

      if (result.success && result.data) {
        setSaveState("saved");
        onChange({
          ...session,
          pageId: result.data.slug,
          sha: result.data.sha,
          isDirty: false,
          updatedAt: result.data.updatedAt,
        });

        // Trigger callback to refresh index summaries in UI
        if (onSaveSuccess) {
          onSaveSuccess(result.data.slug);
        }

        setTimeout(() => {
          setSaveState("idle");
        }, 3000);
      } else {
        setSaveState("idle");
      }
    } catch {
      setSaveState("idle");
    }
  };

  const editorBlocks = EditorAdapter.toEditorModel(session.content);

  return (
    <div className="w-full flex flex-col gap-2">
      {/* Save Action Row */}
      <div className="flex justify-between items-center pb-4 mb-2 select-none border-b border-border/40">
        <span className="text-[10px] text-foreground/45 uppercase tracking-wider">Editor Session</span>
        <SaveButton
          state={saveState}
          onClick={handleSave}
          disabled={!session.isDirty || saveState === "saving"}
        />
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
      <EditorStatus isDirty={session.isDirty} mode={session.mode} />
    </div>
  );
}
