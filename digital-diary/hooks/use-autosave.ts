"use client";

import { useEffect, useRef, useState } from "react";

export function useAutosave(
  content: string,
  onSave: (content: string) => Promise<void>,
  delay: number = 1000
) {
  const [isSaving, setIsSaving] = useState(false);
  const contentRef = useRef(content);
  // Store the timeout ID
  const saveTimeout = useRef<NodeJS.Timeout>(null);

  useEffect(() => {
    if (content === contentRef.current) return;

    if (saveTimeout.current) {
      clearTimeout(saveTimeout.current);
    }

    saveTimeout.current = setTimeout(async () => {
      setIsSaving(true);
      try {
        await onSave(content);
        contentRef.current = content;
      } catch (e) {
        console.error("Autosave failed", e);
      } finally {
        setIsSaving(false);
      }
    }, delay);

    return () => {
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
    };
  }, [content, onSave, delay]);

  return { isSaving };
}
