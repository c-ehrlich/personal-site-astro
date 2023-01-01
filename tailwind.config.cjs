/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--color-background) / <alpha-value>)",
        text: "rgb(var(--color-text) / <alpha-value>)",
        link: "rgb(var(--color-link) / <alpha-value>)",
        test: "green",
      },
    },
  },
  plugins: [],
};
