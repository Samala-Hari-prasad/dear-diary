import { getTrashIndex } from "@/lib/github/storage";
import { format, parseISO } from "date-fns";
import { TrashClient } from "./trash-client";

export default async function TrashPage() {
  const { items } = await getTrashIndex();
  
  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-hidden relative">
      <div className="p-8 pb-4 flex items-center justify-between border-b border-border">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Trash</h1>
          <p className="text-muted-foreground text-sm">Deleted entries. You can restore them or delete them permanently.</p>
        </div>
      </div>
      
      <TrashClient initialItems={items} />
    </div>
  );
}
