"use client";

import { MemoryIndexItem } from "@/lib/github/storage";
import { format, parseISO } from "date-fns";
import { restoreMemory, permanentDeleteMemory, emptyTrash } from "@/lib/actions/memory";
import { useState } from "react";
import { Loader2, Trash2, RotateCcw, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export function TrashClient({ initialItems }: { initialItems: MemoryIndexItem[] }) {
  const [items, setItems] = useState(initialItems);
  const [loading, setLoading] = useState<string | null>(null);
  const [emptying, setEmptying] = useState(false);
  const router = useRouter();

  const handleRestore = async (id: string) => {
    setLoading(id);
    try {
      await restoreMemory(id);
      setItems(items.filter(i => i.id !== id));
      router.refresh();
    } catch (e) {
      console.error(e);
      alert("Failed to restore entry.");
    } finally {
      setLoading(null);
    }
  };

  const handlePermanentDelete = async (id: string) => {
    if (!confirm("Delete Forever?\n\nThis cannot be undone.")) return;
    
    setLoading(id);
    try {
      await permanentDeleteMemory(id);
      setItems(items.filter(i => i.id !== id));
      router.refresh();
    } catch (e) {
      console.error(e);
      alert("Failed to delete entry permanently.");
    } finally {
      setLoading(null);
    }
  };

  const handleEmptyTrash = async () => {
    if (items.length === 0) return;
    if (!confirm("Empty Trash?\n\nAll items will be deleted forever. This cannot be undone.")) return;
    
    setEmptying(true);
    try {
      await emptyTrash();
      setItems([]);
      router.refresh();
    } catch (e) {
      console.error(e);
      alert("Failed to empty trash.");
    } finally {
      setEmptying(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8">
        <Trash2 size={48} className="mb-4 opacity-20" />
        <p>Trash is empty</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-8 pt-4">
      <div className="flex justify-end mb-4">
        <button 
          onClick={handleEmptyTrash} 
          disabled={emptying}
          className="text-sm text-red-500 hover:bg-red-500/10 px-4 py-2 rounded-md transition-colors flex items-center gap-2 font-medium disabled:opacity-50"
        >
          {emptying ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
          Empty Trash
        </button>
      </div>
      
      <div className="grid gap-2">
        {items.map((item) => {
          let dateDisplay = "";
          try {
            dateDisplay = format(parseISO(item.eventDate), "MMM d, yyyy");
          } catch (e) {
            dateDisplay = item.eventDate;
          }
          
          const isActing = loading === item.id;
          
          return (
            <div key={item.id} className="flex items-center justify-between p-4 bg-muted/30 border border-border rounded-lg group">
              <div>
                <h3 className="font-medium text-foreground">{item.title}</h3>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{item.snippet}</p>
                <p className="text-[10px] text-muted-foreground mt-2">{dateDisplay}</p>
              </div>
              
              <div className="flex items-center gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleRestore(item.id)} 
                  disabled={isActing}
                  className="p-2 text-primary hover:bg-primary/10 rounded-md transition-colors disabled:opacity-50"
                  title="Restore"
                >
                  {isActing ? <Loader2 size={18} className="animate-spin" /> : <RotateCcw size={18} />}
                </button>
                <button 
                  onClick={() => handlePermanentDelete(item.id)} 
                  disabled={isActing}
                  className="p-2 text-red-500 hover:bg-red-500/10 rounded-md transition-colors disabled:opacity-50"
                  title="Delete Forever"
                >
                  {isActing ? <Loader2 size={18} className="animate-spin" /> : <AlertCircle size={18} />}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
