"use client";

import { useEffect } from "react";
import { memoryEvents } from "@/lib/client/events";
import { useRouter } from "next/navigation";
import { today } from "@/lib/utils/date";

export function useKeyboardShortcuts() {
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input or textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement).isContentEditable
      ) {
        return;
      }

      // Modifiers
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      if (cmdOrCtrl && e.key === "n") {
        e.preventDefault();
        const d = today();
        // Since we don't have direct access to create memory action here without context,
        // we emit an event or call router if we can. 
        // Actually, the simplest is to emit a global event that sidebar or app-shell listens to
        // Or we can just redirect to the home page with ?date=today (Wait, openOrCreate handles it)
        memoryEvents.emit("memory:opened", { slug: d });
      }

      if (cmdOrCtrl && e.key === "f") {
        e.preventDefault();
        // Focus search bar
        const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement;
        if (searchInput) searchInput.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);
}
