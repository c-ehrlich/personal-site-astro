# Christopher Ehrlich's Personal Site

This is the repo for my personal site. It uses Astro 2.0, with Solid.js islands for interactivity.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command          | Action                                             |
| :--------------- | :------------------------------------------------- |
| `pnpm i`         | Installs dependencies                              |
| `pnpm dev`       | Starts local dev server at `localhost:5432`        |
| `pnpm build`     | Build your production site to `./dist/`            |
| `pnpm preview`   | Preview your build locally, before deploying       |
| `pnpm astro ...` | Run CLI commands like `astro add`, `astro preview` |

## Adding content

To add content, use Markdown files in the `/content` directory. There are folders for three categories: `/blog` (blog posts), `/blog-draft` (same as before, but not published), `/projects` (personal projects, not being used in this version of the website but keeping in case I want to add them again).

When adding a new piece of content, make sure the frontmatter matches the schema in `/content/config.ts`. This site uses the new "Content Collections" feature from Astro 2.0, so the build will fail if any frontmatter doesn't match the schema. This makes the content typesafe and prevents publishing broken/nonstandard markdown files.

## Dynamic Open Graph Images

Due to issues with running Vercel edge functions from an Astro app, Open Graph images are generated from a [separate repo](https://github.com/c-ehrlich/personal-site-ogimage) for the time being. The API call for fetching the images is located in `BaseHead.astro`.