import { z, defineCollection } from "astro:content";
import { glob } from "astro/loaders";

export const SITE = {
  title: "Christopher Ehrlich",
  description: "Christopher Ehrlich's personal website",
  defaultLanguage: "en_US",
};

export const OPEN_GRAPH = {
  image: {
    src: "img/og-image.png",
    alt: "Christopher Ehrlich's personal website",
  },
  twitter: "ccccjjjjeeee",
};

const contentCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/content" }),
  schema: z.object({
    title: z.string().min(1),
    type: z.enum(["article", "talk", "video", "appearance"]),
    description: z.string().min(1),
    published: z
      .string()
      .regex(/^\d{4}\/\d{2}\/\d{2}$/)
      .transform((str) => new Date(str)),
    updated: z
      .string()
      .regex(/^\d{4}\/\d{2}\/\d{2}$/)
      .transform((str) => new Date(str))
      .optional(),
    tags: z.array(z.string().min(1)),
    videoLength: z.number().min(1).optional(),
  }),
});

const projectsCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    published: z
      .string()
      .regex(/^\d{4}\/\d{2}\/\d{2}$/)
      .transform((str) => new Date(str)),
    tags: z.array(z.string()),
    image: z
      .string()
      .regex(/\/([^\/^.]+\/)+[^\/^.]+\.(jpg|jpeg|png|gif|webp|svg)$/),
    github: z.string().url().optional(),
    deployed: z.string().url().optional(),
  }),
});

const miscCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/misc" }),
  schema: z.object({
    title: z.string(),
  }),
});

const bookNotesCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/bookNotes" }),
  schema: z.object({
    title: z.string(),
    published: z
      .string()
      .regex(/^\d{4}\/\d{2}\/\d{2}$/)
      .transform((str) => new Date(str)),
  }),
});

const blogDraftCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog-draft" }),
  schema: z.object({}).passthrough(),
});

export const collections = {
  content: contentCollection,
  projects: projectsCollection,
  misc: miscCollection,
  bookNotes: bookNotesCollection,
  "blog-draft": blogDraftCollection,
};
