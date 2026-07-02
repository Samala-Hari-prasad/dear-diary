import { DocumentBlock } from "@/types/models/diary-page";

export function deserializeBlocks(blocks: DocumentBlock[]): any[] {
  return blocks.map((block) => {
    let blockNoteType = "paragraph";
    const props: Record<string, any> = {};
    let content: any[] = [];

    if (block.type === "heading") {
      blockNoteType = "heading";
      props.level = block.props?.level || 1;
      content = [{ type: "text", text: block.content || "", styles: {} }];
    } else if (block.type === "image") {
      blockNoteType = "image";
      props.url = block.content || "";
    } else {
      blockNoteType = "paragraph";
      content = [{ type: "text", text: block.content || "", styles: {} }];
    }

    return {
      id: block.id,
      type: blockNoteType,
      props,
      content,
      children: [],
    };
  });
}
