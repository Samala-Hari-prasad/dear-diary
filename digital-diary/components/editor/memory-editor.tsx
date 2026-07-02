"use client";

import { useTheme } from "next-themes";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import { uploadMedia } from "@/lib/media/uploader";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";

interface MemoryEditorProps {
  initialContent?: any[];
  onChange: (blocks: any[]) => void;
  editable: boolean;
}

export default function MemoryEditor({
  initialContent,
  onChange,
  editable,
}: MemoryEditorProps) {
  const { resolvedTheme } = useTheme();

  const editor = useCreateBlockNote({
    initialContent: initialContent && initialContent.length > 0 ? initialContent : undefined,
    uploadFile: async (file) => {
      // Resizes, converts to webp, and uploads directly via client-side uploader pipeline
      const asset = await uploadMedia(file);
      return asset.url;
    },
  });

  const currentTheme = resolvedTheme === "dark" ? "dark" : "light";

  return (
    <div className="w-full text-left font-body leading-relaxed max-w-[720px] mx-auto min-h-[300px]">
      <BlockNoteView
        editor={editor}
        editable={editable}
        onChange={() => {
          onChange(editor.document);
        }}
        theme={currentTheme}
      />
    </div>
  );
}
