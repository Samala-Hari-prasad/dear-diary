import { Editor } from "@/components/editor";
import { getPage } from "@/lib/github/storage";
import { notFound } from "next/navigation";
import matter from "gray-matter";

export default async function EntryPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

  if (id === "new") {
    const today = new Date().toISOString().split("T")[0];
    const now = new Date().toISOString();
    return <Editor initialId="" initialContent="" isNew={true} initialEventDate={today} initialCreatedAt={now} />;
  }

  const page = await getPage(id);
  if (!page) {
    notFound();
  }

  const parsed = matter(page.content);
  
  return <Editor 
    initialId={id} 
    initialContent={parsed.content} 
    isNew={false} 
    initialEventDate={parsed.data.eventDate || ""}
    initialCreatedAt={parsed.data.createdAt || ""}
  />;
}
