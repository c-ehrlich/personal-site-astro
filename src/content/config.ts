import { z, defineCollection } from "astro:content";

const blog = defineCollection({
  schema: {
    title: z.string(),
    description: z.string(),
    published: z.date(),
    updated: z.date().optional(),
    // published: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    // updated: z
    //   .string()
    //   .regex(/^\d{4}-\d{2}-\d{2}$/)
    //   .optional(),
    tags: z.array(z.string()),
  },
});

const projects = defineCollection({
  schema: {
    title: z.string(),
    description: z.string(),
    published: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    tags: z.array(z.string()),
    // TODO: better image validator (/**/*.{png,jpg,jpeg,gif,svg}})
    image: z.string(),
    github: z.string().url().optional(),
    deployed: z.string().url().optional(),
  },
});

export const collections = {
  blog,
  projects,
};
