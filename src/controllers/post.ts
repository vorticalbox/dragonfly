import { z } from '../../deps.ts'
import { oak } from '../../deps.ts';
import { ctx } from '../types.ts'
import Post from '../models/post.ts';
import { getLoggedInUser } from "./user.ts";

const postValidation = z.object({
  title: z.string()
    .min(10, 'title must be at least 10 characters long')
    .max(150, 'title must not be longer then 150 characters'),
  body: z.string()
    .min(10, 'title must be at least characters long')
    .max(2000, 'title must not be longer then 2000 characters'),
})


export async function getPosts({ response }: oak.Context) {
  response.body = await Post.limit(50).orderBy('updatedAt', "desc").all()
}

export async function addPost(ctx: oak.Context) {
  const post = await ctx.request.body({ type: "json" }).value;
  const parsedPost = postValidation.parse(post);
  const user = getLoggedInUser(ctx);
  ctx.response.body = await Post.create({ ...parsedPost, username: user.username });
}

export default {
  getPosts,
  addPost,
}