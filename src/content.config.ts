import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.string(),
  }),
});

const courses = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/courses' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    order: z.number(),
    comingSoon: z.boolean().default(false),
    section: z.string().optional(),
    sectionOrder: z.number().optional(),
    isWorksheet: z.boolean().default(false),
  }),
});

export const collections = { posts, courses };





