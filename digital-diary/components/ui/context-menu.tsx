"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";

export interface ContextMenuItem {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  destructive?: boolean;
}

interface ContextMenuProps {
  isOpen: boolean;
  x: number;
  y: number;
  items: ContextMenuItem[];
  onClose: () => void;
}

export function ContextMenu({ isOpen, x, y, items, onClose }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    // Adjust position if it goes off screen
    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      if (rect.right > window.innerWidth) {
        menuRef.current.style.left = `${window.innerWidth - rect.width - 8}px`;
      }
      if (rect.bottom > window.innerHeight) {
        menuRef.current.style.top = `${window.innerHeight - rect.height - 8}px`;
      }
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    const timer = setTimeout(() => {
      document.addEventListener("click", handleClickOutside);
      document.addEventListener("contextmenu", handleClickOutside);
    }, 0);
    document.addEventListener("keydown", handleEscape);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("contextmenu", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div
      ref={menuRef}
      className="fixed z-[100] min-w-48 bg-background border border-border rounded-md shadow-lg py-1 flex flex-col animate-in fade-in zoom-in-95 duration-100"
      style={{ top: y, left: x }}
    >
      {items.map((item, idx) => {
        if (item.label === "-") {
          return <div key={idx} className="h-px bg-border my-1" />;
        }
        return (
          <button
            key={idx}
            onClick={(e) => { e.stopPropagation(); item.onClick(); onClose(); }}
            className={`flex items-center gap-3 px-3 py-1.5 text-sm text-left transition-colors outline-none focus-visible:bg-foreground/10 ${
              item.destructive
                ? "text-red-500 hover:bg-red-500/10 focus-visible:bg-red-500/10"
                : "text-foreground hover:bg-foreground/5"
            }`}
          >
            {item.icon && <span className="w-4 h-4 flex items-center justify-center opacity-70">{item.icon}</span>}
            {item.label}
          </button>
        );
      })}
    </div>,
    document.body
  );
}

// Hook to manage global context menu state for a list
export function useContextMenuList<T>() {
  const [menuState, setMenuState] = useState<{
    isOpen: boolean;
    x: number;
    y: number;
    activeItem: T | null;
  }>({
    isOpen: false,
    x: 0,
    y: 0,
    activeItem: null,
  });

  const handleContextMenu = useCallback((e: React.MouseEvent, item: T) => {
    e.preventDefault();
    setMenuState({
      isOpen: true,
      x: e.clientX,
      y: e.clientY,
      activeItem: item,
    });
  }, []);

  const handleActionClick = useCallback((e: React.MouseEvent, item: T) => {
    e.stopPropagation();
    e.preventDefault();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setMenuState({
      isOpen: true,
      x: rect.right - 100, // Roughly position left of button
      y: rect.bottom,
      activeItem: item,
    });
  }, []);

  const close = useCallback(() => setMenuState((prev) => ({ ...prev, isOpen: false })), []);

  return { ...menuState, handleContextMenu, handleActionClick, close };
}
