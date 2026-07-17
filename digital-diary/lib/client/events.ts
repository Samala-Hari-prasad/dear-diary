import { DiaryPageSummary } from "@/types/models/diary-summary";

export interface MemoryEvents {
  "memory:created": { summary: DiaryPageSummary };
  "memory:opened": { slug: string };
  "memory:updated": { summary: DiaryPageSummary };
  "memory:deleted": { slug: string };
  "memory:restored": { summary: DiaryPageSummary };
  "memory:duplicated": { summary: DiaryPageSummary };
  "memory:dateChanged": {
    slug: string;
    oldDate: string;
    newDate: string;
  };
}

export type MemoryEventType = keyof MemoryEvents;
export type MemoryEventHandler<T extends MemoryEventType> = (payload: MemoryEvents[T]) => void;

class TypedEventEmitter {
  private listeners: {
    [K in MemoryEventType]?: Set<MemoryEventHandler<K>>;
  } = {};

  on<T extends MemoryEventType>(event: T, handler: MemoryEventHandler<T>) {
    if (!this.listeners[event]) {
      this.listeners[event] = new Set() as any;
    }
    this.listeners[event]!.add(handler as any);
    return () => this.off(event, handler);
  }

  off<T extends MemoryEventType>(event: T, handler: MemoryEventHandler<T>) {
    if (this.listeners[event]) {
      this.listeners[event]!.delete(handler as any);
    }
  }

  emit<T extends MemoryEventType>(event: T, payload: MemoryEvents[T]) {
    if (this.listeners[event]) {
      this.listeners[event]!.forEach((handler: any) => handler(payload));
    }
  }
}

export const memoryEvents = new TypedEventEmitter();
