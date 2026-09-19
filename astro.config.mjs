import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  prefetch: true,
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [mdx()],
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
