import { Editor } from "@/components/editor";
import { ReadingMode } from "@/components/reading-mode";
import { getPage } from "@/lib/github/storage";
import { notFound } from "next/navigation";
import matter from "gray-matter";

export default async function EntryPage(props: { params: Promise<{ id: string }>, searchParams: Promise<{ date?: string }> }) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const id = params.id;

  if (id === "new") {
    const today = new Date().toISOString().split("T")[0];
    const targetDate = searchParams.date || today;
    const now = new Date().toISOString();
    return <Editor initialId="" initialContent="" isNew={true} initialEventDate={targetDate} initialCreatedAt={now} />;
  }

  const page = await getPage(id);
  if (!page) {
    notFound();
  }

  const parsed = matter(page.content);
  
  return <ReadingMode 
    id={id}
    title={parsed.data.title || "Untitled"}
    content={parsed.content}
    eventDate={parsed.data.eventDate || ""}
  />;
}
