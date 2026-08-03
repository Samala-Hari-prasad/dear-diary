"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useAutosave } from "@/hooks/use-autosave";
import { updateMemory, createMemory, deleteMemory, checkExistingEntry } from "@/lib/actions/memory";
import { uploadAttachment } from "@/lib/actions/attachment";
import { useRouter } from "next/navigation";
import { Trash2, Image as ImageIcon, Loader2, Columns, Type, Eye, CalendarIcon } from "lucide-react";
import { compressImage, cn } from "@/lib/utils";
import { MarkdownRenderer } from "./markdown-renderer";

type EditorMode = "write" | "split" | "preview";

export function Editor({
  initialId,
  initialContent,
  isNew,
  initialEventDate,
  initialCreatedAt,
}: {
  initialId: string;
  initialContent: string;
  isNew: boolean;
  initialEventDate: string;
  initialCreatedAt: string;
}) {
  const router = useRouter();
  const [id, setId] = useState(initialId);
  const [content, setContent] = useState(initialContent);
  const [eventDate, setEventDate] = useState(initialEventDate);
  const [savedOnce, setSavedOnce] = useState(!isNew);
  const [uploading, setUploading] = useState(false);
  const [mode, setMode] = useState<EditorMode>("write");
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);
  const ignoreDuplicateRef = useRef(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const extractTitle = (text: string) => {
    const firstLine = text.split("\n")[0] || "Untitled";
    return firstLine.replace(/^#+\s/, "");
  };

  const { saveState, errorMessage, forceSave } = useAutosave(content, async (newContent) => {
    if (!newContent.trim()) return;
    const title = extractTitle(newContent);
    
    if (!savedOnce) {
       if (!ignoreDuplicateRef.current) {
         const existingId = await checkExistingEntry(eventDate);
         if (existingId) {
           setDuplicateWarning(existingId);
           return;
         }
       }
       const newId = crypto.randomUUID();
       setId(newId);
       setSavedOnce(true);
       await createMemory(newId, title, newContent, eventDate, initialCreatedAt);
       window.history.replaceState(null, "", `/entry/${newId}`);
    } else {
       await updateMemory(id, title, newContent, eventDate);
    }
  }, 1000);

  // If eventDate changes and we're not new, force a save so the date update persists
  useEffect(() => {
    if (savedOnce) forceSave();
  }, [eventDate, savedOnce, forceSave]);

  const handleDelete = async () => {
    if (confirm("Move to trash?")) {
      await deleteMemory(id);
      router.push("/");
    }
  };

  const handleFileUpload = useCallback(async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      
      let finalFile: File = file;
      if (file.type.startsWith("image/")) {
        finalFile = await compressImage(file);
      }
      
      formData.append("file", finalFile);
      const url = await uploadAttachment(formData);
      
      const isImage = finalFile.type.startsWith("image/");
      const mdStr = isImage ? `![${finalFile.name}](${url})` : `[${finalFile.name}](${url})`;
      
      const textarea = textareaRef.current;
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const textBefore = content.substring(0, start);
        const textAfter = content.substring(end);
        setContent(textBefore + `\n${mdStr}\n` + textAfter);
      } else {
        setContent(prev => prev + `\n${mdStr}\n`);
      }
    } catch {
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  }, [content, setContent]);

  const handleFileUploadEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && (file.type.startsWith("image/") || file.type.startsWith("audio/") || file.type === "application/pdf")) {
      handleFileUpload(file);
    }
  }, [handleFileUpload]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const file = e.clipboardData.files?.[0];
    if (file && (file.type.startsWith("image/") || file.type.startsWith("audio/") || file.type === "application/pdf")) {
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

  const isBackfilled = initialCreatedAt && eventDate !== initialCreatedAt.split('T')[0] && !isNew;

  return (
    <div className="flex flex-col h-full mx-auto w-full max-w-6xl relative">
      {duplicateWarning && (
        <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-card p-6 rounded-lg border border-border shadow-lg max-w-sm w-full text-center">
            <h3 className="text-lg font-semibold mb-2">Entry exists</h3>
            <p className="text-muted-foreground mb-6">You already have an entry for {eventDate}.</p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => router.push(`/entry/${duplicateWarning}`)} 
                className="bg-primary text-primary-foreground py-2 rounded-md font-medium"
              >
                Open Existing
              </button>
              <button 
                onClick={() => {
                  ignoreDuplicateRef.current = true;
                  setDuplicateWarning(null);
                  forceSave(true);
                }} 
                className="text-muted-foreground hover:text-foreground py-2 font-medium"
              >
                Create Another Anyway
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between p-4 border-b border-border shrink-0 flex-wrap gap-4">
        <div className="flex items-start gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground/70">Event Date</label>
            <div className="flex items-center gap-2 bg-muted/30 px-2 py-1 rounded-md border border-border/50">
              <CalendarIcon size={14} className="text-muted-foreground" />
              <input 
                type="date" 
                value={eventDate} 
                onChange={(e) => setEventDate(e.target.value)} 
                className="bg-transparent border-none text-foreground font-medium p-0 focus:ring-0 text-sm outline-none" 
              />
            </div>
          </div>
          
          <div className="flex flex-col gap-1 justify-center min-w-[100px] pt-1">
            {isBackfilled && (
              <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full w-fit">
                Recorded on {initialCreatedAt.split('T')[0]}
              </span>
            )}
            <div className="flex flex-col">
              <span className={cn("text-xs font-medium", saveState === "Upload Failed" ? "text-red-500" : "text-muted-foreground")}>
                {saveState}
              </span>
              {saveState === "Upload Failed" && errorMessage && (
                <span className="text-xs text-red-500 max-w-[200px] truncate" title={errorMessage}>
                  {errorMessage}
                </span>
              )}
            </div>
          </div>
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
          <label className="p-2 text-muted-foreground hover:bg-muted rounded-md cursor-pointer transition-colors relative" title="Upload Attachment">
            {uploading ? <Loader2 size={18} className="animate-spin" /> : <ImageIcon size={18} />}
            <input type="file" className="hidden" accept="image/*,audio/*,application/pdf" onChange={handleFileUploadEvent} disabled={uploading} />
          </label>
          
          <button
            onClick={() => forceSave()}
            className={cn(
              "px-3 py-1.5 text-sm font-medium rounded-md transition-colors ml-2",
              saveState === "Saving..." ? "bg-muted text-muted-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            )}
            disabled={saveState === "Saving..."}
          >
            {saveState === "Saving..." ? "Saving..." : "Save"}
          </button>

          {!isNew && (
            <>
              <button onClick={handleDelete} className="p-2 text-red-500 hover:bg-red-500/10 rounded-md transition-colors" title="Move to Trash">
                <Trash2 size={18} />
              </button>
              <button 
                onClick={() => router.push(`/entry/${id}`)}
                className="px-3 py-1.5 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Done
              </button>
            </>
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
