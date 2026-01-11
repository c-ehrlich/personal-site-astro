import getReadingtime from "reading-time";
import type { CollectionEntry } from "astro:content";

export function readTime(
  post: CollectionEntry<"content"> | CollectionEntry<"blog-draft">,
) {
  if (post.data.videoLength) {
    return `${post.data.videoLength} min video`;
  }

  return getReadingtime(post.body ?? "").text;
}
