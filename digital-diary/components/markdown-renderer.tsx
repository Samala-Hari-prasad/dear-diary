import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { FileText, Download } from "lucide-react";

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none w-full p-8 overflow-y-auto">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]} 
        rehypePlugins={[rehypeSlug, rehypeAutolinkHeadings]}
        components={{
          a: ({ node, href, children, ...props }) => {
            if (!href) return <a {...props}>{children}</a>;
            
            const lowerHref = href.toLowerCase();
            
            if (lowerHref.endsWith(".pdf")) {
              return (
                <a href={href} target="_blank" rel="noopener noreferrer" className="not-prose flex items-center p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors group no-underline my-4 w-fit min-w-[300px]">
                  <div className="bg-red-500/10 p-3 rounded-md mr-4 text-red-500">
                    <FileText size={24} />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="font-medium text-foreground truncate m-0 leading-tight">{children || "PDF Document"}</p>
                    <p className="text-xs text-muted-foreground mt-1 mb-0">PDF File</p>
                  </div>
                  <Download size={18} className="text-muted-foreground opacity-50 group-hover:opacity-100 transition-opacity ml-4" />
                </a>
              );
            }
            
            if (lowerHref.endsWith(".mp3") || lowerHref.endsWith(".wav") || lowerHref.endsWith(".m4a") || lowerHref.endsWith(".ogg")) {
              return (
                <div className="not-prose my-6 w-full max-w-md bg-muted/20 p-4 rounded-lg border border-border">
                  <p className="text-sm font-medium mb-3 text-foreground flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                    {children || "Audio Recording"}
                  </p>
                  <audio controls src={href} className="w-full h-10 outline-none" />
                </div>
              );
            }
            
            return <a href={href} {...props}>{children}</a>;
          }
        }}
      >
        {content || "*No content yet*"}
      </ReactMarkdown>
    </div>
  );
}
