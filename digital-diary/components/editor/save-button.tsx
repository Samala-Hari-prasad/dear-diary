import { Loader2, Check, AlertTriangle, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

export type SaveState = "idle" | "saving" | "saved" | "conflict";

interface SaveButtonProps {
  state: SaveState;
  onClick: () => void;
  disabled?: boolean;
}

export function SaveButton({ state, onClick, disabled = false }: SaveButtonProps) {
  const getButtonContent = () => {
    switch (state) {
      case "saving":
        return (
          <>
            <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
            <span>Saving...</span>
          </>
        );
      case "saved":
        return (
          <>
            <Check className="mr-2 h-3.5 w-3.5 text-green-500" />
            <span>Saved</span>
          </>
        );
      case "conflict":
        return (
          <>
            <AlertTriangle className="mr-2 h-3.5 w-3.5 text-accent" />
            <span>Conflict</span>
          </>
        );
      default:
        return (
          <>
            <Save className="mr-2 h-3.5 w-3.5" />
            <span>Save</span>
          </>
        );
    }
  };

  return (
    <Button
      variant="ghost"
      onClick={onClick}
      disabled={disabled || state === "saving"}
      className="text-xs uppercase tracking-wider h-8 font-normal"
      aria-label="Save current session draft"
    >
      {getButtonContent()}
    </Button>
  );
}
