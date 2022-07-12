import { CTX } from "../types/oak.ts";
import post_service from './post_service.ts';
import parseQuery from '../utils/query.ts';
import { oak } from '../deps.ts'

export default function (router: oak.Router) {
  router.get('/post', async (ctx) => {
    const { skip, limit } = parseQuery(ctx)
    ctx.response.body = await post_service.get_posts(skip, limit);
  });
  router.post('/post', async (ctx: CTX) => {
    const post = await ctx.request.body({ type: "json" }).value;
    const user = ctx.state.user;
    ctx.response.body = await post_service.create_post(post, user);
  });
}