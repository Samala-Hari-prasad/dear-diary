import { ThemeToggle } from "@/components/ui/theme-toggle";
import { APP_NAME } from "@/constants/app";

export function Header() {
  return (
    <header className="flex w-full items-center justify-between border-b border-border px-6 py-4 md:px-12">
      <h1 className="font-heading text-xl font-medium tracking-wide md:text-2xl">
        {APP_NAME}
      </h1>
      <ThemeToggle />
    </header>
  );
}
