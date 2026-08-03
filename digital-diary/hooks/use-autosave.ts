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
  const isSavingRef = useRef(false);

  const performSave = useCallback(async (currentContent: string) => {
    if (!navigator.onLine) {
      setSaveState("Offline");
      return;
    }
    
    if (isSavingRef.current) {
      // If a save is already in progress, we don't want to run concurrently.
      // The useEffect will trigger again when content changes, but if it doesn't,
      // we need to ensure the latest content gets saved eventually.
      // A simple way is to just let the timeout handle it later, or queue it.
      // But actually, just returning is fine if the timeout is still running?
      // No, if we return, it's dropped. So we should re-trigger the timeout.
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
      saveTimeout.current = setTimeout(() => performSave(currentContent), 1000);
      return;
    }
    
    isSavingRef.current = true;
    
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
    } finally {
      isSavingRef.current = false;
    }
  }, [onSave]);

  const forceSave = useCallback(async (force: boolean = false) => {
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    if (force || content !== contentRef.current) {
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
