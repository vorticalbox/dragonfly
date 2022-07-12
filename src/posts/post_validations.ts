import { z } from "../deps.ts";

export const post_validation = z.object({
  title: z.string()
    .min(10, 'title must be at least 10 characters long')
    .max(150, 'title must not be longer then 150 characters'),
  body: z.string()
    .min(10, 'title must be at least characters long')
    .max(2000, 'title must not be longer then 2000 characters'),
})
