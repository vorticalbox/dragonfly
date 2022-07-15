import { z } from "../deps.ts";

export const register_schema = z.object({
  username: z.string()
    .max(50, 'username must not be longer then 50 characters'),
  password: z.string()
    .min(7, 'title must be at least 7 characters long')
})