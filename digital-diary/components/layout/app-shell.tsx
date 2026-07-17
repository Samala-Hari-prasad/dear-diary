import { ReactNode } from "react";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { Toaster } from "@/components/ui/toast";

interface AppShellProps {
  children: ReactNode;
  sidebar?: ReactNode;
}

export function AppShell({ children, sidebar }: AppShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        {sidebar !== undefined ? sidebar : <Sidebar />}
        <main className="flex-1 px-6 py-8 md:px-12 md:py-12 overflow-y-auto max-h-[calc(100vh-64px)]">
          {children}
        </main>
      </div>
      <Toaster />
    </div>
  );
}
