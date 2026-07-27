import Link from "next/link";
import { getIndex } from "@/lib/github/storage";
import { Plus } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { SidebarClient } from "./sidebar-client";

export async function AppSidebar() {
  const { items } = await getIndex();

  return (
    <div className="w-72 border-r border-border bg-muted/20 h-screen flex flex-col">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h1 className="font-semibold text-lg tracking-tight">Dear Diary</h1>
        <ThemeToggle />
      </div>
      <div className="p-2 border-b border-border">
        <Link href="/memory/new" className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md hover:bg-foreground hover:text-background bg-foreground/5 transition-colors">
          <Plus size={16} /> New Entry
        </Link>
      </div>
      <SidebarClient items={items} />
      <div className="p-2 border-t border-border">
        <form action="/api/auth/logout" method="POST">
          <button type="submit" className="w-full text-left px-3 py-2 text-sm font-medium rounded-md hover:bg-red-500/10 text-red-500 transition-colors">
            Log out
          </button>
        </form>
      </div>
    </div>
  );
}
