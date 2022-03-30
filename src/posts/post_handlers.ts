import post_service from './post_service.ts';
import parseQuery from '../utils/query.ts';
import { CTX } from "../types/oak.ts";


export async function get_posts(ctx: CTX) {
  const { skip, limit } = parseQuery(ctx)
  ctx.response.body = await post_service.get_posts(skip, limit);
}

export async function add_post(ctx: CTX) {
  const post = await ctx.request.body({ type: "json" }).value;
  const user = ctx.state.user;
  ctx.response.body = await post_service.create_post(post, user);
}

export default {
  get_posts,
  add_post,
}