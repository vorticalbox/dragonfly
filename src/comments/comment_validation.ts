import { z } from "../deps.ts";


export type IComment = {
  post_id: string
  body: string
}
export const comment_validation = z.object({
    post_id: z.string(),
    body: z.string()
      .min(10, 'title must be at least characters long')
      .max(2000, 'title must not be longer then 2000 characters'),
  });