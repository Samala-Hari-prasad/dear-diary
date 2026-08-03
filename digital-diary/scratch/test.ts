import { createMemory, updateMemory } from "../lib/actions/memory";
import { getIndex, getPage } from "../lib/github/storage";
import matter from "gray-matter";

async function run() {
  console.log("=== Testing Core Flow ===");
  // Create today's entry
  const today = new Date().toISOString().split("T")[0];
  console.log("Creating entry for today:", today);
  const result1 = await createMemory(today, "Today's title", "Today's content");
  console.log("Created:", result1);

  console.log("Fetching page to check metadata integrity...");
  const page1 = await getPage(result1.id);
  const parsed1 = matter(page1!.content);
  console.log("Frontmatter:", parsed1.data);
  if (parsed1.data.eventDate !== today) throw new Error("eventDate mismatch");
  if (!parsed1.data.createdAt || !parsed1.data.updatedAt) throw new Error("missing dates");
  
  console.log("=== Testing Backfill Flow ===");
  const backfillDate = "2025-08-15";
  console.log("Creating entry for:", backfillDate);
  const result2 = await createMemory(backfillDate, "Backfill title", "Backfill content");
  console.log("Created:", result2);

  console.log("Fetching page to check metadata integrity...");
  const page2 = await getPage(result2.id);
  const parsed2 = matter(page2!.content);
  console.log("Frontmatter:", parsed2.data);
  if (parsed2.data.eventDate !== backfillDate) throw new Error("eventDate mismatch");

  console.log("=== Testing Edit Flow ===");
  console.log("Updating backfill entry...");
  const result3 = await updateMemory(result2.id, backfillDate, "Updated title", "Updated content", parsed2.data.createdAt);
  console.log("Updated:", result3);

  const page3 = await getPage(result2.id);
  const parsed3 = matter(page3!.content);
  console.log("Updated Frontmatter:", parsed3.data);
  if (parsed3.data.createdAt !== parsed2.data.createdAt) throw new Error("createdAt changed!");
  if (parsed3.data.updatedAt === parsed2.data.updatedAt) throw new Error("updatedAt did not change!");

  console.log("=== Testing Duplicate Flow (Backend) ===");
  const { items } = await getIndex();
  const existing = items.find(i => i.eventDate === backfillDate);
  if (existing) {
    console.log(`Duplicate exists for ${backfillDate}. The frontend handles showing the dialog, but the backend allows it to be created if passed through.`);
  }

  console.log("All backend metadata integrity checks passed!");
}

run().catch(console.error);
