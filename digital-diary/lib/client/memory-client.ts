import { MemoryResult } from "@/lib/repository/memory-service";

export async function openOrCreateMemory(date: string): Promise<MemoryResult> {
  const res = await fetch("/api/v1/diary/pages/open-or-create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ date }),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody?.error?.message || "Failed to open or create memory");
  }

  const data = await res.json();
  if (!data.success) {
    throw new Error(data.error?.message || "Failed to open or create memory");
  }

  return data.data;
}

export async function deleteMemoryApi(slug: string): Promise<void> {
  const res = await fetch(`/api/v1/diary/pages/${slug}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody?.error?.message || "Failed to delete memory");
  }

  const data = await res.json();
  if (!data.success) {
    throw new Error(data.error?.message || "Failed to delete memory");
  }
}

export async function changeDateApi(slug: string, date: string): Promise<void> {
  const res = await fetch(`/api/v1/diary/pages/${slug}/date`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ date }),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody?.error?.message || "Failed to change date");
  }

  const data = await res.json();
  if (!data.success) {
    throw new Error(data.error?.message || "Failed to change date");
  }
}
