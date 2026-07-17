import { Cloud, CloudOff, Loader2, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";

export type SyncStatus = "idle" | "pending" | "syncing" | "synced" | "conflict" | "error";

interface EditorStatusProps {
  status: SyncStatus;
  mode: "read" | "edit";
  onRetry?: () => void;
}

export function EditorStatus({ status, mode, onRetry }: EditorStatusProps) {
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    if (status === "synced") {
      setShowSaved(true);
      const timer = setTimeout(() => {
        setShowSaved(false);
      }, 2000);
      return () => clearTimeout(timer);
    } else if (status !== "idle") {
      setShowSaved(false);
    }
  }, [status]);

  if (mode === "read") return null;

  const getStatusDisplay = () => {
    switch (status) {
      case "pending":
        return (
          <div className="flex items-center gap-1.5 text-foreground/40">
            <Cloud className="w-3.5 h-3.5" />
            <span className="font-normal uppercase tracking-wider text-[10px]">Unsaved</span>
          </div>
        );
      case "syncing":
        return (
          <div className="flex items-center gap-1.5 text-accent animate-pulse">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span className="font-medium uppercase tracking-wider text-[10px]">Saving...</span>
          </div>
        );
      case "synced":
      case "idle":
        if (status === "synced" && showSaved) {
          return (
            <div className="flex items-center gap-1.5 text-green-500/80 animate-in fade-in duration-300">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span className="font-medium uppercase tracking-wider text-[10px]">Saved</span>
            </div>
          );
        }
        return null;
      case "conflict":
      case "error":
        return (
          <div className="flex items-center gap-2 text-red-500/80">
            <CloudOff className="w-3.5 h-3.5" />
            <span className="font-medium uppercase tracking-wider text-[10px]">Failed to Save</span>
            {onRetry && (
              <button 
                onClick={onRetry}
                className="ml-2 text-[10px] uppercase tracking-wider bg-red-500/10 hover:bg-red-500/20 px-2 py-0.5 rounded transition-colors"
              >
                Retry
              </button>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex items-start justify-between text-xs text-foreground/45 border-t border-border/60 pt-4 mt-8 select-none">
      <div className="flex items-center gap-2">
        <span className={`h-1.5 w-1.5 rounded-full bg-accent ${status === "syncing" ? "animate-ping" : "opacity-50"}`} />
        <span>Writing Mode</span>
      </div>
      <div className="transition-opacity duration-300 min-h-[20px] flex items-center">{getStatusDisplay()}</div>
    </div>
  );
}
