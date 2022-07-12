import { CTX } from "../types/oak.ts";
import parseQuery from '../utils/query.ts';
import * as comments from './comment_service.ts'
import { oak } from '../deps.ts'

const { helpers } = oak;
export default function (router: oak.Router) {
    router.get('/comment', async (ctx) => {
        const { skip, limit } = parseQuery(ctx)
        const { post_id } = helpers.getQuery(ctx, { mergeParams: true });
        if (!post_id) {
            ctx.response.status = 404;
            ctx.response.body = 'Invalid post_id';
            return;
        }
        ctx.response.body = await comments.getComments(post_id, skip, limit)
    });
    router.post('/comment', async (ctx: CTX) => {
        const { post_id } = helpers.getQuery(ctx, { mergeParams: true });
        const comment = await ctx.request.body({ type: "json" }).value;
        ctx.response.body = await comments.addComment({ post_id, ...comment }, ctx.state.user.username)
    });
}