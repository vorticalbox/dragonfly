import { z, oak } from '../deps.ts'
import Comment from './comment_model.ts';
import Post from '../posts/post_model.ts';
import { get_user } from "../users/user_service.ts";
import parseQuery from '../utils/query.ts'


const { helpers } = oak;

const commentValidation = z.object({
  post_id: z.string(),
  body: z.string()
    .min(10, 'title must be at least characters long')
    .max(2000, 'title must not be longer then 2000 characters'),
});

export async function getComments(ctx: oak.Context) {
  const { post_id } = helpers.getQuery(ctx, { mergeParams: true });
  const { skip, limit } = parseQuery(ctx);
  if (!post_id) {
    ctx.response.status = 404;
    ctx.response.body = 'Invalid post_id';
    return;
  }
  ctx.response.body = await Comment.where({ post_id }).skip(skip).limit(limit).orderBy('updatedAt', "desc").all()
}


export async function addComment(ctx: oak.Context) {
  const { post_id } = helpers.getQuery(ctx, { mergeParams: true });
  if (!post_id) {
    ctx.response.status = 404;
    ctx.response.body = 'Invalid post_id';
    return;
  }
  const comment = await ctx.request.body({ type: "json" }).value;
  const parsed_comment = commentValidation.parse({ ...comment, post_id, });
  const post = await Post.where({ _id: comment.post_id }).all();
  if (post.length === 0) {
    ctx.response.status = 404;
    ctx.response.body = 'Invalid post_id';
  } else {
    const user = get_user(ctx);
    ctx.response.body = await Comment.create({ ...parsed_comment, username: user.username });
  }
}


export default {
  getComments,
  addComment,
}