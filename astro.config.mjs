import { defineConfig } from "astro/config";
import solidJs from "@astrojs/solid-js";
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  prefetch: true,
  integrations: [
    solidJs(),
    tailwind({
      config: {
        applyBaseStyles: false,
      },
    }),
    mdx(),
  ],
  markdown: {
    shikiConfig: {
      // theme list: https://github.com/shikijs/shiki/blob/main/docs/themes.md#all-themes
      theme: "dark-plus",
      wrap: true,
    },
    smartypants: false,
    gfm: false,
  },
  output: "static",
  site: "https://c-ehrlich.dev/",
  redirects: {
    "/blog/golang": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
});
