import { z } from '../deps.ts'
import Post from './post_model.ts';
import parseQuery from '../utils/query.ts';
import { CTX } from "../types/oak.ts";

const postValidation = z.object({
  title: z.string()
    .min(10, 'title must be at least 10 characters long')
    .max(150, 'title must not be longer then 150 characters'),
  body: z.string()
    .min(10, 'title must be at least characters long')
    .max(2000, 'title must not be longer then 2000 characters'),
})


export async function getPosts(ctx: CTX) {
  const { skip, limit } = parseQuery(ctx)
  ctx.response.body = await Post.skip(skip).limit(limit).orderBy('updatedAt', "desc").all()
}

export async function addPost(ctx: CTX) {
  const post = await ctx.request.body({ type: "json" }).value;
  const parsedPost = postValidation.parse(post);
  const user = ctx.state.user;
  ctx.response.body = await Post.create({ ...parsedPost, username: user.username });
}

export default {
  getPosts,
  addPost,
}