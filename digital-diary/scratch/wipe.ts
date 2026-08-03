import { getIndex, saveIndex, getPage, deletePageFile } from "../lib/github/storage";
import { githubFetch } from "../lib/github/client";

async function run() {
  console.log("Fetching index...");
  const { items, sha } = await getIndex();
  console.log(`Found ${items.length} items in index.`);

  for (const item of items) {
    const slug = (item as any).slug || item.id;
    console.log(`Deleting ${slug}...`);
    const page = await getPage(slug);
    if (page) {
      await deletePageFile(slug, page.sha);
      console.log(`Deleted page ${slug}.`);
    } else {
      console.log(`Page ${slug} not found, skipping delete.`);
    }
  }

  console.log("Saving empty index...");
  await saveIndex([], sha);
  console.log("Done.");
}

run().catch(console.error);
