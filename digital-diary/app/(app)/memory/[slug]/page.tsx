import { Editor } from "@/components/editor";
import { getPage } from "@/lib/github/storage";
import { notFound } from "next/navigation";

export default async function MemoryPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const slug = params.slug;

  if (slug === "new") {
    return <Editor initialSlug="new" initialContent="" isNew={true} />;
  }

  const page = await getPage(slug);
  if (!page) {
    notFound();
  }

  return <Editor initialSlug={slug} initialContent={page.content} isNew={false} />;
}
