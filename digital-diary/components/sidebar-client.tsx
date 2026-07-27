"use client";
import Link from "next/link";
import { useState } from "react";
import { MemoryIndexItem } from "@/lib/github/storage";
import { Search } from "lucide-react";

export function SidebarClient({ items }: { items: MemoryIndexItem[] }) {
  const [search, setSearch] = useState("");
  const [dateStr, setDateStr] = useState("");
  
  const filtered = items.filter(item => {
    if (search && !item.title.toLowerCase().includes(search.toLowerCase()) && !item.snippet.toLowerCase().includes(search.toLowerCase())) return false;
    if (dateStr && !item.date.startsWith(dateStr)) return false;
    return true;
  });

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="p-2 space-y-2 border-b border-border">
        <div className="relative">
          <Search size={14} className="absolute left-2 top-2.5 text-muted-foreground" />
          <input 
            type="search" 
            placeholder="Search..." 
            className="w-full pl-8 pr-2 py-1.5 text-sm rounded-md border border-border bg-background focus:outline-none focus:ring-1 focus:ring-ring"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <input 
          type="date" 
          className="w-full px-2 py-1.5 text-sm rounded-md border border-border bg-background focus:outline-none focus:ring-1 focus:ring-ring text-muted-foreground"
          value={dateStr}
          onChange={e => setDateStr(e.target.value)}
        />
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {filtered.map((item) => (
          <Link key={item.slug} href={`/memory/${item.slug}`} className="block p-3 text-sm rounded-md hover:bg-muted transition-colors border border-transparent hover:border-border">
            <div className="font-medium truncate text-foreground">{item.title}</div>
            <div className="text-xs text-muted-foreground truncate mt-1">{item.snippet}</div>
            <div className="text-[10px] text-muted-foreground mt-2">{new Date(item.date).toLocaleDateString()}</div>
          </Link>
        ))}
        {filtered.length === 0 && (
          <div className="text-center text-sm text-muted-foreground p-4">No entries found</div>
        )}
      </div>
    </div>
  );
}
