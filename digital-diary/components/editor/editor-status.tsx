export type SyncStatus = "idle" | "pending" | "syncing" | "synced" | "conflict";

interface EditorStatusProps {
  status: SyncStatus;
  mode: "read" | "edit";
}

export function EditorStatus({ status, mode }: EditorStatusProps) {
  if (mode === "read") return null;

  const getStatusDisplay = () => {
    switch (status) {
      case "pending":
        return (
          <span className="text-foreground/40 font-normal uppercase tracking-wider text-[10px]">
            Pending Sync
          </span>
        );
      case "syncing":
        return (
          <span className="text-accent font-medium uppercase tracking-wider text-[10px] animate-pulse">
            Saving...
          </span>
        );
      case "synced":
        return (
          <span className="text-green-500 font-medium uppercase tracking-wider text-[10px]">
            Synced
          </span>
        );
      case "conflict":
        return (
          <div className="flex flex-col items-end gap-1 text-right max-w-md">
            <span className="text-accent font-medium uppercase tracking-wider text-[10px]">
              Conflict Detected
            </span>
            <span className="text-[11px] text-accent/80 font-light normal-case">
              Synchronization conflict detected. Your local edits are still safe. Please reload the page before continuing.
            </span>
          </div>
        );
      default:
        return (
          <span className="text-foreground/30 font-normal uppercase tracking-wider text-[10px]">
            Saved to draft
          </span>
        );
    }
  };

  return (
    <div className="flex items-start justify-between text-xs text-foreground/45 border-t border-border/60 pt-4 mt-8 select-none">
      <div className="flex items-center gap-2">
        <span className={`h-1.5 w-1.5 rounded-full bg-accent ${status === "syncing" ? "animate-ping" : "animate-pulse"}`} />
        <span>Writing Mode</span>
      </div>
      <div>{getStatusDisplay()}</div>
    </div>
  );
}
