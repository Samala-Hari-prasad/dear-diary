"use client";

import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { 
  Plus, 
  Clock, 
  Search, 
  Sun, 
  Moon, 
  Settings,
  CalendarDays
} from "lucide-react";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { setTheme, theme } = useTheme();

  useEffect(() => {
    setMounted(true);
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  if (!open || !mounted) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] bg-background/80 backdrop-blur-sm p-4" onClick={(e) => {
      if (e.target === e.currentTarget) setOpen(false);
    }}>
      <Command 
        className="w-full max-w-lg bg-background border border-border rounded-xl shadow-2xl overflow-hidden flex flex-col"
        onKeyDown={(e) => {
          if (e.key === "Escape") setOpen(false);
        }}
        loop
      >
        <Command.Input 
          autoFocus
          placeholder="Type a command or search..." 
          className="w-full px-4 py-3 text-lg border-b border-border bg-transparent outline-none placeholder:text-muted-foreground"
        />
        
        <Command.List className="max-h-[300px] overflow-y-auto p-2">
          <Command.Empty className="p-4 text-center text-sm text-muted-foreground">
            No results found.
          </Command.Empty>

          <Command.Group heading="Writing" className="px-2 py-2 text-xs font-medium text-muted-foreground">
            <Command.Item 
              onSelect={() => {
                setOpen(false);
                router.push("/entry/new");
              }}
              className="flex items-center gap-2 px-2 py-2 mt-1 text-sm text-foreground rounded-md cursor-pointer aria-selected:bg-muted hover:bg-muted"
            >
              <Plus size={16} /> New Entry
            </Command.Item>
          </Command.Group>

          <Command.Group heading="Discovery" className="px-2 py-2 text-xs font-medium text-muted-foreground">
            <Command.Item 
              onSelect={() => {
                setOpen(false);
                router.push("/?tab=timeline");
              }}
              className="flex items-center gap-2 px-2 py-2 mt-1 text-sm text-foreground rounded-md cursor-pointer aria-selected:bg-muted hover:bg-muted"
            >
              <Clock size={16} /> Open Timeline
            </Command.Item>
            <Command.Item 
              onSelect={() => {
                setOpen(false);
                router.push("/?tab=calendar");
              }}
              className="flex items-center gap-2 px-2 py-2 mt-1 text-sm text-foreground rounded-md cursor-pointer aria-selected:bg-muted hover:bg-muted"
            >
              <CalendarDays size={16} /> Open Calendar
            </Command.Item>
            <Command.Item 
              onSelect={() => {
                setOpen(false);
                alert("Search not implemented yet");
              }}
              className="flex items-center gap-2 px-2 py-2 mt-1 text-sm text-foreground rounded-md cursor-pointer aria-selected:bg-muted hover:bg-muted"
            >
              <Search size={16} /> Search Entries
            </Command.Item>
          </Command.Group>

          <Command.Group heading="System" className="px-2 py-2 text-xs font-medium text-muted-foreground">
            <Command.Item 
              onSelect={() => {
                setOpen(false);
                setTheme(theme === "dark" ? "light" : "dark");
              }}
              className="flex items-center gap-2 px-2 py-2 mt-1 text-sm text-foreground rounded-md cursor-pointer aria-selected:bg-muted hover:bg-muted"
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />} Toggle Theme
            </Command.Item>
            <Command.Item 
              onSelect={() => {
                setOpen(false);
                alert("Settings not implemented yet");
              }}
              className="flex items-center gap-2 px-2 py-2 mt-1 text-sm text-foreground rounded-md cursor-pointer aria-selected:bg-muted hover:bg-muted"
            >
              <Settings size={16} /> Go to Settings
            </Command.Item>
          </Command.Group>
        </Command.List>
      </Command>
    </div>
  );
}
