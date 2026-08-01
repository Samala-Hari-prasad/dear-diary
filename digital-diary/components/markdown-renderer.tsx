import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none w-full p-8 overflow-y-auto">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]} 
        rehypePlugins={[rehypeSlug, rehypeAutolinkHeadings]}
      >
        {content || "*No content yet*"}
      </ReactMarkdown>
    </div>
  );
}
