"use client";

import { useState, useRef, useCallback } from "react";
import { useAutosave } from "@/hooks/use-autosave";
import { updateMemory, createMemory, deleteMemory } from "@/lib/actions/memory";
import { uploadImage } from "@/lib/actions/image";
import { useRouter } from "next/navigation";
import { Trash2, Image as ImageIcon, Loader2, Columns, Type, Eye } from "lucide-react";
import { compressImage, cn } from "@/lib/utils";
import { MarkdownRenderer } from "./markdown-renderer";

type EditorMode = "write" | "split" | "preview";

export function Editor({
  initialSlug,
  initialContent,
  isNew,
}: {
  initialSlug: string;
  initialContent: string;
  isNew: boolean;
}) {
  const router = useRouter();
  const [slug, setSlug] = useState(initialSlug);
  const [content, setContent] = useState(initialContent);
  const [savedOnce, setSavedOnce] = useState(!isNew);
  const [uploading, setUploading] = useState(false);
  const [mode, setMode] = useState<EditorMode>("write");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const extractTitle = (text: string) => {
    const firstLine = text.split("\n")[0] || "Untitled";
    return firstLine.replace(/^#+\s/, "");
  };

  const { saveState, errorMessage, forceSave } = useAutosave(content, async (newContent) => {
    if (!newContent.trim()) return;
    const title = extractTitle(newContent);
    if (!savedOnce) {
       const newSlug = new Date().toISOString().split('T')[0] + "-" + Math.random().toString(36).substring(2, 8);
       setSlug(newSlug);
       setSavedOnce(true);
       await createMemory(newSlug, title, newContent);
       window.history.replaceState(null, "", `/memory/${newSlug}`);
    } else {
       await updateMemory(slug, title, newContent);
    }
  }, 1000);

  const handleDelete = async () => {
    if (confirm("Move to trash?")) {
      await deleteMemory(slug);
      router.push("/");
    }
  };

  const handleFileUpload = useCallback(async (file: File) => {
    setUploading(true);
    try {
      const compressed = await compressImage(file);
      const formData = new FormData();
      formData.append("file", compressed);
      const url = await uploadImage(formData);
      
      const textarea = textareaRef.current;
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const textBefore = content.substring(0, start);
        const textAfter = content.substring(end);
        setContent(textBefore + `\n![${file.name}](${url})\n` + textAfter);
      } else {
        setContent(prev => prev + `\n![${file.name}](${url})\n`);
      }
    } catch {
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  }, [content, uploadImage, setContent]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      handleFileUpload(file);
    }
  }, [handleFileUpload]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const file = e.clipboardData.files?.[0];
    if (file && file.type.startsWith("image/")) {
      e.preventDefault();
      handleFileUpload(file);
    }
  }, [handleFileUpload]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "s") {
      e.preventDefault();
      forceSave();
    }
  }, [forceSave]);

  return (
    <div className="flex flex-col h-full mx-auto w-full max-w-6xl">
      <div className="flex items-center justify-between p-4 border-b border-border shrink-0">
        <div className="text-sm text-muted-foreground flex flex-col justify-center min-w-[100px]">
          <span className={cn("font-medium", saveState === "Upload Failed" ? "text-red-500" : "")}>
            {saveState}
          </span>
          {saveState === "Upload Failed" && errorMessage && (
            <span className="text-xs text-red-500 max-w-[200px] truncate" title={errorMessage}>
              {errorMessage}
            </span>
          )}
        </div>
        
        <div className="flex bg-muted/50 rounded-md p-1 border border-border">
          <button 
            onClick={() => setMode("write")} 
            className={cn("p-1.5 rounded-sm transition-colors flex items-center gap-2 px-3 text-sm", mode === "write" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}
            title="Write Mode"
          >
            <Type size={16} /> <span className="hidden sm:inline">Write</span>
          </button>
          <button 
            onClick={() => setMode("split")} 
            className={cn("p-1.5 rounded-sm transition-colors flex items-center gap-2 px-3 text-sm", mode === "split" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}
            title="Split Mode"
          >
            <Columns size={16} /> <span className="hidden sm:inline">Split</span>
          </button>
          <button 
            onClick={() => setMode("preview")} 
            className={cn("p-1.5 rounded-sm transition-colors flex items-center gap-2 px-3 text-sm", mode === "preview" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}
            title="Preview Mode"
          >
            <Eye size={16} /> <span className="hidden sm:inline">Preview</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <label className="p-2 text-muted-foreground hover:bg-muted rounded-md cursor-pointer transition-colors relative" title="Upload Image">
            {uploading ? <Loader2 size={18} className="animate-spin" /> : <ImageIcon size={18} />}
            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
          </label>
          {!isNew && (
            <button onClick={handleDelete} className="p-2 text-red-500 hover:bg-red-500/10 rounded-md transition-colors" title="Move to Trash">
              <Trash2 size={18} />
            </button>
          )}
        </div>
      </div>
      
      <div 
        className="flex-1 flex overflow-hidden relative"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onPaste={handlePaste}
        onKeyDown={handleKeyDown}
      >
        {(mode === "write" || mode === "split") && (
          <textarea
            ref={textareaRef}
            className={cn(
              "flex-1 w-full p-8 bg-transparent resize-none focus:outline-none text-lg leading-relaxed",
              mode === "split" ? "border-r border-border" : ""
            )}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="# Title\n\nStart writing..."
          />
        )}
        {(mode === "preview" || mode === "split") && (
          <div className="flex-1 overflow-y-auto">
            <MarkdownRenderer content={content} />
          </div>
        )}
      </div>
    </div>
  );
}
