import { DocumentBlock } from "@/types/models/diary-page";
import { serializeBlocks } from "./serializer";
import { deserializeBlocks } from "./deserializer";

export const EditorAdapter = {
  toStorageModel: (blocks: any[]): DocumentBlock[] => {
    return serializeBlocks(blocks);
  },
  toEditorModel: (blocks: DocumentBlock[]): any[] => {
    return deserializeBlocks(blocks);
  },
};
