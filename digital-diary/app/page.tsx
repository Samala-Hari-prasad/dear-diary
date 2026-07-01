import { Plus, NotebookPen } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RepositoryStatus } from "@/components/status/repository-status";
import {
  APP_TAGLINE,
  EMPTY_STATE_SUBTITLE,
  EMPTY_STATE_TITLE,
  NEW_MEMORY_LABEL,
  getGreeting,
} from "@/constants/app";

const USER_NAME = "Hari";

export default function Home() {
  const greeting = getGreeting();

  return (
    <AppShell>
      <section className="mx-auto flex max-w-2xl flex-col items-center gap-16 text-center">
        <div className="flex flex-col gap-4">
          <h2 className="font-heading text-3xl font-light tracking-wide leading-tight md:text-4xl">
            {greeting}, {USER_NAME}
          </h2>
          <p className="font-heading text-lg italic text-foreground/75 leading-relaxed md:text-xl">
            &ldquo;{APP_TAGLINE}&rdquo;
          </p>
        </div>

        <Button type="button">
          <Plus size={16} strokeWidth={1.5} aria-hidden="true" />
          {NEW_MEMORY_LABEL}
        </Button>

        <Card className="flex w-full flex-col items-center gap-4 py-24 px-6 md:py-32">
          <NotebookPen
            size={32}
            strokeWidth={1.0}
            className="text-foreground/35 mb-2"
            aria-hidden="true"
          />
          <h3 className="font-heading text-xl font-light text-foreground/80 tracking-wide leading-relaxed md:text-2xl">
            {EMPTY_STATE_TITLE}
          </h3>
          <p className="text-sm font-normal text-foreground/60 max-w-sm leading-relaxed">
            {EMPTY_STATE_SUBTITLE}
          </p>
        </Card>

        <RepositoryStatus />
      </section>
    </AppShell>
  );
}
