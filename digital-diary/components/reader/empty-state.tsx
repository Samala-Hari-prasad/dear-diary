import { NotebookPen } from "lucide-react";
import { Card } from "@/components/ui/card";

interface EmptyStateProps {
  type?: "no-selection" | "empty-repo";
}

export function EmptyState({ type = "no-selection" }: EmptyStateProps) {
  return (
    <Card className="flex w-full flex-col items-center gap-4 py-24 px-6 md:py-32 text-center">
      <NotebookPen
        size={32}
        strokeWidth={1.0}
        className="text-foreground/35 mb-2"
        aria-hidden="true"
      />
      {type === "no-selection" ? (
        <>
          <h3 className="font-heading text-xl font-light text-foreground/80 tracking-wide leading-relaxed md:text-2xl">
            Your diary is ready.
          </h3>
          <p className="text-sm font-normal text-foreground/60 max-w-sm leading-relaxed">
            Select a memory from the list to begin reading.
          </p>
        </>
      ) : (
        <>
          <h3 className="font-heading text-xl font-light text-foreground/80 tracking-wide leading-relaxed md:text-2xl">
            There are no memories yet.
          </h3>
          <p className="text-sm font-normal text-foreground/60 max-w-sm leading-relaxed">
            Your diary is connected successfully. When you create your first memory, it will appear here.
          </p>
        </>
      )}
    </Card>
  );
}
