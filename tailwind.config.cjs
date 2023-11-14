/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--color-background) / <alpha-value>)",
        text: "hsl(var(--color-text) / <alpha-value>)",
        link: "hsl(var(--color-link) / <alpha-value>)",
      },
      screens: {
        xs: "375px", // iPhone SE 2020
      },
    },
  },
  plugins: [],
};
