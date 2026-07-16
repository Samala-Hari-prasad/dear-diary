"use client";

import { useState, useRef, useEffect } from "react";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

interface AvatarDropdownProps {
  avatarUrl?: string;
  name?: string;
  username?: string;
}

export function AvatarDropdown({ avatarUrl, name, username }: AvatarDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const displayName = name || username || "User";

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-accent"
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label="User menu"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={avatarUrl}
          alt={displayName}
          width={32}
          height={32}
          className="rounded-full bg-foreground/10"
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md border border-border bg-background py-1 shadow-lg z-50">
          <div className="px-4 py-2 border-b border-border">
            <p className="text-sm font-medium text-foreground truncate">
              {displayName}
            </p>
          </div>
          <button
            onClick={handleLogout}
            disabled={loading}
            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-foreground/5 disabled:opacity-50 text-left"
          >
            <LogOut size={16} />
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
