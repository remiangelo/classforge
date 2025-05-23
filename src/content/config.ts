import { defineCollection, z } from 'astro:content';

const announcements = defineCollection({
  schema: z.object({
    title: z.string(),
    date: z.string(),
  }),
});

export const collections = {
  announcements,
}; 