import { defineConfig } from "astro/config";

import image from "@astrojs/image";
import solidJs from "@astrojs/solid-js";
import tailwind from "@astrojs/tailwind";

/** @type {import('vite').Plugin} */
const hexLoader = {
  name: "hex-loader",
  transform(code, id) {
    const [path, query] = id.split("?");
    if (query != "raw-hex") return null;

    const data = fs.readFileSync(path);
    const hex = data.toString("hex");

    return `export default '${hex}';`;
  },
};

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
      // theme list: https://github.com/shikijs/shiki/blob/main/docs/themes.md#all-themes
      theme: "dark-plus",
      wrap: true,
    },
    smartypants: false, // TODO: could try using this
    gfm: false, // TODO: could try using this
  },
  output: "static",
  site: "https://c-ehrlich.dev/",
  vite: {
    plugins: [hexLoader],
  },
});
