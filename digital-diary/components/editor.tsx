"use client";

import { useState } from "react";
import { useAutosave } from "@/hooks/use-autosave";
import { updateMemory, createMemory, deleteMemory } from "@/lib/actions/memory";
import { uploadImage } from "@/lib/actions/image";
import { useRouter } from "next/navigation";
import { Trash2, Image as ImageIcon, Loader2 } from "lucide-react";

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

  const extractTitle = (text: string) => {
    const firstLine = text.split("\n")[0] || "Untitled";
    return firstLine.replace(/^#+\s/, "");
  };

  const { isSaving } = useAutosave(content, async (newContent) => {
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    
    try {
      const url = await uploadImage(formData);
      setContent(prev => prev + `\n![${file.name}](${url})\n`);
    } catch {
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="text-sm text-muted-foreground flex items-center gap-2">
          {isSaving ? "Saving..." : "Saved"}
        </div>
        <div className="flex items-center gap-2">
          <label className="p-2 text-muted-foreground hover:bg-muted rounded-md cursor-pointer transition-colors relative">
            {uploading ? <Loader2 size={18} className="animate-spin" /> : <ImageIcon size={18} />}
            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
          </label>
          {!isNew && (
            <button onClick={handleDelete} className="p-2 text-red-500 hover:bg-red-500/10 rounded-md transition-colors">
              <Trash2 size={18} />
            </button>
          )}
        </div>
      </div>
      <textarea
        className="flex-1 w-full p-8 bg-transparent resize-none focus:outline-none text-lg leading-relaxed"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="# Title\n\nStart writing..."
      />
    </div>
  );
}
