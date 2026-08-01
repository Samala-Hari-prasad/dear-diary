import { AppSidebar } from "@/components/app-sidebar";
import { CommandPalette } from "@/components/command-palette";

export const dynamic = "force-dynamic";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <AppSidebar />
      <main className="flex-1 h-screen overflow-y-auto">
        {children}
      </main>
      <CommandPalette />
    </div>
  );
}
