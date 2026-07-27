import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { Github } from "lucide-react";

export default async function LoginPage() {
  const session = await getSession();
  if (session) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="mx-auto flex w-full max-w-sm flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            The Digital Diary
          </h1>
          <p className="text-sm text-muted-foreground">
            Sign in with GitHub to access your memories.
          </p>
        </div>
        <a
          href="/api/auth/github"
          className="inline-flex h-10 items-center justify-center rounded-md bg-foreground px-8 text-sm font-medium text-background shadow transition-colors hover:bg-foreground/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
        >
          <Github className="mr-2 h-4 w-4" />
          Sign in with GitHub
        </a>
      </div>
    </div>
  );
}
