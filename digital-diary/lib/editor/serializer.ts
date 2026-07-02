import { DocumentBlock } from "@/types/models/diary-page";

export function serializeBlocks(blocks: any[]): DocumentBlock[] {
  return blocks.map((block) => {
    let type: "paragraph" | "heading" | "image" = "paragraph";
    const props: Record<string, any> = {};

    if (block.type === "heading") {
      type = "heading";
      props.level = block.props?.level || 1;
    } else if (block.type === "image") {
      type = "image";
    }

    let content = "";
    if (block.type === "image") {
      content = block.props?.url || "";
    } else if (Array.isArray(block.content)) {
      content = block.content.map((item: any) => item.text || "").join("");
    } else if (typeof block.content === "string") {
      content = block.content;
    }

    return {
      id: block.id,
      type,
      props,
      content,
    };
  });
}
