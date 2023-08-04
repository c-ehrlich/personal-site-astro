import { defineConfig } from "astro/config";
import image from "@astrojs/image";
import solidJs from "@astrojs/solid-js";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  experimental: {
    viewTransitions: true,
  },
  integrations: [
    image({
      serviceEntryPoint: "@astrojs/image/sharp",
    }),
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
});
