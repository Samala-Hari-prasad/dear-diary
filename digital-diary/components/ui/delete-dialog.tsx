import { Button } from "./button";

interface DeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  isDeleting: boolean;
}

export function DeleteDialog({ isOpen, onClose, onConfirm, title, isDeleting }: DeleteDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-lg border border-border bg-background p-6 shadow-lg shadow-black/5 animate-in fade-in zoom-in-95 duration-200">
        <h3 className="mb-2 font-heading text-xl text-foreground">Delete Memory</h3>
        <p className="mb-6 text-sm text-foreground/70">
          Are you sure you want to delete <span className="font-semibold text-foreground">&quot;{title}&quot;</span>? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            className="bg-red-500/90 text-white hover:bg-red-500"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    </div>
  );
}
