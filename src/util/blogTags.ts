import { getCollection } from "astro:content";

export async function createBlogTagList() {
  const allPosts = await getCollection("content");
  const allTags = allPosts.map((post) => post.data.tags).flat();
  const uniqueTags = [...new Set(allTags)].sort((a, b) => a.localeCompare(b));
  return uniqueTags;
}

export type BlogTagWithCount = {
  tag: string;
  count: number;
};

export async function createBlogTagListWithCount(): Promise<
  BlogTagWithCount[]
> {
  const allBlogPosts = await getCollection("content");
  const allTags = allBlogPosts.map((post) => post.data.tags).flat();
  const tagsWithCountMap = new Map<string, number>();
  allTags.forEach((tag) => {
    const count = tagsWithCountMap.get(tag) || 0;
    tagsWithCountMap.set(tag, count + 1);
  });
  const tagsWithCount = [...tagsWithCountMap.entries()]
    .map((item) => ({ tag: item[0], count: item[1] }))
    .sort((a, b) => a.tag.localeCompare(b.tag));
  return tagsWithCount;
}
