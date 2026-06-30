"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, Monitor } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-9 items-center gap-1 rounded-sm border border-border p-1">
        <div className="h-7 w-7" />
        <div className="h-7 w-7" />
        <div className="h-7 w-7" />
      </div>
    );
  }

  const themes = [
    { value: "light", icon: Sun, label: "Light theme" },
    { value: "dark", icon: Moon, label: "Dark theme" },
    { value: "system", icon: Monitor, label: "System theme" },
  ] as const;

  return (
    <div
      role="group"
      aria-label="Select theme"
      className="flex items-center gap-1 rounded-sm border border-border p-1"
    >
      {themes.map(({ value, icon: Icon, label }) => {
        const isActive = theme === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => setTheme(value)}
            aria-label={label}
            aria-pressed={isActive}
            className={`flex h-7 w-7 items-center justify-center rounded-sm transition-colors duration-200 ease-out ${
              isActive
                ? "bg-accent text-background"
                : "text-foreground/75 hover:bg-foreground/5 hover:text-foreground"
            }`}
          >
            <Icon size={14} strokeWidth={1.5} />
          </button>
        );
      })}
    </div>
  );
}
