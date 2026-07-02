export function tokenize(query: string): string[] {
  return query
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ")
    .split(" ")
    .filter((token) => token.length > 0);
}
