import { getCollection } from "astro:content";

export async function createBlogTagList() {
  const allBlogPosts = await getCollection("blog");
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
