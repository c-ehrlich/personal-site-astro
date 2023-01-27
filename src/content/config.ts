import { z, defineCollection } from "astro:content";

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

const blogCollection = defineCollection({
  schema: z.object({
    title: z.string().min(1),
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
  }),
});

const projectsCollection = defineCollection({
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
      // match any subpath to an image ie "/a/b/c/d.jpg"
      .regex(/\/([^\/^.]+\/)+[^\/^.]+\.(jpg|jpeg|png|gif|webp|svg)$/),
    github: z.string().url().optional(),
    deployed: z.string().url().optional(),
  }),
});

export const collections = {
  blog: blogCollection,
  projects: projectsCollection,
};
