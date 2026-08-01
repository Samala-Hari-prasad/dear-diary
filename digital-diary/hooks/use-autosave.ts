"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export type SaveState = "Idle" | "Saving..." | "Saved" | "Upload Failed" | "Offline" | "Retrying...";

export function useAutosave(
  content: string,
  onSave: (content: string) => Promise<void>,
  delay: number = 1000
) {
  const [saveState, setSaveState] = useState<SaveState>("Idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const contentRef = useRef(content);
  const saveTimeout = useRef<NodeJS.Timeout | null>(null);

  const performSave = useCallback(async (currentContent: string) => {
    if (!navigator.onLine) {
      setSaveState("Offline");
      return;
    }
    setSaveState("Saving...");
    setErrorMessage(null);
    try {
      await onSave(currentContent);
      contentRef.current = currentContent;
      setSaveState("Saved");
      
      setTimeout(() => {
        setSaveState(prev => (prev === "Saved" ? "Idle" : prev));
      }, 2000);
    } catch (e: any) {
      console.error("Autosave failed", e);
      if (e.message && e.message.includes("Conflict")) {
        setErrorMessage("This entry changed elsewhere. Refresh to load the latest version.");
      } else if (e.message && e.message.includes("429")) {
        setErrorMessage("Rate limit exceeded. Please wait a moment.");
      } else {
        setErrorMessage("Failed to save changes. Will retry.");
      }
      setSaveState("Upload Failed");
    }
  }, [onSave]);

  const forceSave = useCallback(async () => {
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    if (content !== contentRef.current) {
      await performSave(content);
    } else {
      setSaveState("Saved");
      setTimeout(() => {
        setSaveState(prev => (prev === "Saved" ? "Idle" : prev));
      }, 2000);
    }
  }, [content, performSave]);

  useEffect(() => {
    if (content === contentRef.current) return;

    if (saveTimeout.current) {
      clearTimeout(saveTimeout.current);
    }

    setSaveState("Idle");

    saveTimeout.current = setTimeout(() => {
      performSave(content);
    }, delay);

    return () => {
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
    };
  }, [content, performSave, delay]);

  return { saveState, errorMessage, forceSave };
}
