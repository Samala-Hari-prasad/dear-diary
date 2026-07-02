"use client";

import dynamic from "next/dynamic";
import { EditorSession } from "@/types/models/editor-document";
import { EditorHeader } from "./editor-header";
import { EditorStatus } from "./editor-status";
import { EditorAdapter } from "@/lib/editor/adapter";

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
}

export function EditorContainer({ session, onChange }: EditorContainerProps) {
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

  const editorBlocks = EditorAdapter.toEditorModel(session.content);

  return (
    <div className="w-full flex flex-col gap-2">
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
