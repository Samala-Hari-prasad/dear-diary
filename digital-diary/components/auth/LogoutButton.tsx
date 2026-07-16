"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
      setLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      className="px-3 py-2"
      onClick={handleLogout}
      disabled={loading}
      aria-label="Logout"
      title="Logout"
    >
      <LogOut size={18} strokeWidth={1.5} />
    </Button>
  );
}
