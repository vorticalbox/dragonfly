import { oak, z, } from "./deps.ts";
// controller imports
import posts from './posts/post_handlers.ts';
import user_router from './users/user_router.ts';
import comment from './comments/comment_handlers.ts';
import { validate_token } from './middleware/token.ts';
const { Router } = oak;
const router = new Router();

router.use(async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      ctx.response.status = 422
      return ctx.response.body = {
        message: 'validation error',
        issues: error.issues,
      }
    }
    console.error(error);
    ctx.response.status = 500
    return ctx.response.body = {
      message: 'There was a problem handling this request',
    }
  }
});
router.get('/heartbeat', ({ response }: oak.Context) => response.body = 'hello world');
user_router(router);
router.use(validate_token);
router.get('/post', posts.getPosts);
router.post('/post', posts.addPost);
router.get('/comment', comment.getComments);
router.post('/comment', comment.addComment);

router.use((ctx) => {
  ctx.response.status = 404;
  ctx.response.body = 'Not Found';
})

export default router;