import { defineConfig } from "astro/config";

import image from "@astrojs/image";
import solidJs from "@astrojs/solid-js";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  experimental: {
    contentCollections: true,
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
  ],
  markdown: {
    shikiConfig: {
      // TODO: pick a theme from https://github.com/shikijs/shiki/blob/main/docs/themes.md#all-themes
      theme: "vitesse-light",
      wrap: true,
    },
    extendDefaultPlugins: true,
  },
});
