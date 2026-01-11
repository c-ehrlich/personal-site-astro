import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

const BLOG_TITLE = "Christopher Ehrlich's Blog";
const BLOG_DESCRIPTION =
  "I write about tech, education, OSS, and other things.";

export async function GET() {
  const posts = await getCollection("content");
  const items = posts
    .sort(
      (a, b) =>
        new Date(b.data.published).getTime() -
        new Date(a.data.published).getTime(),
    )
    .map((post) => ({
      title: post.data.title,
      description: post.data.description,
      link: post.slug,
      pubDate: post.data.published,
    }));

  return rss({
    // `<title>` field in output xml
    title: BLOG_TITLE,
    // `<description>` field in output xml
    description: BLOG_DESCRIPTION,
    // base URL for RSS <item> links
    // SITE will use "site" from your project's astro.config.
    site: import.meta.env.SITE,
    // list of `<item>`s in output xml
    items,
    // (optional) inject custom xml
    customData: `<language>en-us</language>`,
    stylesheet: "/rss/styles.xsl",
  });
}
