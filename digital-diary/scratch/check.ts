import { getIndex } from "../lib/github/storage";
async function check() {
  const data = await getIndex();
  console.log("INDEX DATA:", JSON.stringify(data, null, 2));
}
check();
