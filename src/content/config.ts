import { z, defineCollection } from "astro:content";

const blog = defineCollection({
  schema: {
    title: z.string(),
    description: z.string(),
    published: z
      .string()
      .regex(/^\d{4}\/\d{2}\/\d{2}$/)
      .transform((str) => new Date(str)),
    updated: z
      .string()
      .regex(/^\d{4}\/\d{2}\/\d{2}$/)
      .transform((str) => new Date(str))
      .optional(),
    tags: z.array(z.string()),
  },
});

const projects = defineCollection({
  schema: {
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
  },
});

export const collections = {
  blog,
  projects,
};
