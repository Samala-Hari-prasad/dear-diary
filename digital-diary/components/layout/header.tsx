/* eslint-disable @next/next/no-img-element */
"use client";

import { ThemeToggle } from "@/components/ui/theme-toggle";
import { APP_NAME } from "@/constants/app";
import { useAuthStatus } from "@/hooks/use-auth-status";
import { LoginButton } from "@/components/auth/LoginButton";
import { AvatarDropdown } from "@/components/auth/avatar-dropdown";

export function Header() {
  const { authenticated, loading, avatarUrl, name, username } = useAuthStatus();

  return (
    <header className="flex w-full items-center justify-between border-b border-border px-6 py-4 md:px-12">
      <h1 className="font-heading text-xl font-medium tracking-wide md:text-2xl">
        {APP_NAME}
      </h1>
      <div className="flex items-center gap-4">
        {!loading && (
          authenticated ? (
            <AvatarDropdown
              avatarUrl={avatarUrl}
              name={name}
              username={username}
            />
          ) : (
            <LoginButton />
          )
        )}
        <ThemeToggle />
      </div>
    </header>
  );
}
