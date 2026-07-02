interface EditorStatusProps {
  isDirty: boolean;
  mode: "read" | "edit";
}

export function EditorStatus({ isDirty, mode }: EditorStatusProps) {
  if (mode === "read") return null;

  return (
    <div className="flex items-center justify-between text-xs text-foreground/40 border-t border-border/60 pt-4 mt-8 select-none">
      <div className="flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
        <span>Writing Mode</span>
      </div>
      <div>
        {isDirty ? (
          <span className="text-accent font-medium uppercase tracking-wider text-[10px]">
            Unsaved Changes
          </span>
        ) : (
          <span className="font-normal uppercase tracking-wider text-[10px]">
            Saved to draft
          </span>
        )}
      </div>
    </div>
  );
}
