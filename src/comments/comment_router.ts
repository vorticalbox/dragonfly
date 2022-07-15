import { CTX } from "../types/oak.ts";
import parseQuery from '../utils/query.ts';
import * as comment_service from './comment_service.ts'
import * as post_service from '../posts/post_service.ts'
import { oak } from '../deps.ts'

const { helpers } = oak;
export default function (router: oak.Router) {
    router.get('/comment', async (ctx) => {
        const { skip, limit } = parseQuery(ctx)
        const { post_id } = helpers.getQuery(ctx, { mergeParams: true });
        const post = await post_service.get_post(post_id)
        if (!post) {
            ctx.response.status = 404;
            ctx.response.body = 'Invalid post_id';
            return;
        }
        ctx.response.body = await comment_service.getComments(post_id, skip, limit)
    });
    router.post('/comment', async (ctx: CTX) => {
        const { post_id } = helpers.getQuery(ctx, { mergeParams: true });
        const comment = await ctx.request.body({ type: "json" }).value;
        ctx.response.body = await comment_service.addComment({ post_id, ...comment }, ctx.state.user.username)
    });
}