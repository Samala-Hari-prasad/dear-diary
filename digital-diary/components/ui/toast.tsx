"use client";

import { useToast, dismissToast } from "@/hooks/use-toast";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

export function Toaster() {
  const { toasts } = useToast();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted || toasts.length === 0) return null;

  return createPortal(
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-3 pointer-events-none">
      {toasts.map((t) => (
        <div 
          key={t.id} 
          className="pointer-events-auto bg-foreground text-background px-5 py-3.5 rounded-lg shadow-xl flex items-center justify-between gap-6 min-w-80 max-w-sm animate-in slide-in-from-bottom-5 fade-in duration-300"
        >
          <p className="text-sm font-medium tracking-wide">{t.message}</p>
          {t.action && (
            <button
              type="button"
              onClick={() => { t.action!.onClick(); dismissToast(t.id); }}
              className="text-sm font-bold uppercase tracking-widest text-background opacity-80 hover:opacity-100 transition-opacity whitespace-nowrap"
            >
              {t.action.label}
            </button>
          )}
        </div>
      ))}
    </div>,
    document.body
  );
}
