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
});
