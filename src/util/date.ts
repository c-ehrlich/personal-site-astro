export function formatBlogDate(date: Date): string {
  return date.toLocaleString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
