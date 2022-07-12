import { oak, z, } from "./deps.ts";
// controller imports
import user_router from './users/user_router.ts';
import post_router from './posts/post_router.ts';
import comment_router from './comments/comment_router.ts';
import { validate_token } from './middleware/token.ts';
import { CTX } from "./types/oak.ts";
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
        isOperational: true,
      }
    }
    console.error(error);
    ctx.response.status = 500
    return ctx.response.body = {
      message: 'There was a problem handling this request',
      isOperational: false,
    }
  }
});
router.get('/heartbeat', ({ response }: CTX) => response.body = 'hello world');
user_router(router);
// thing below here requires a token
router.use(validate_token);
post_router(router);
comment_router(router)

router.use((ctx) => {
  ctx.response.status = 404;
  ctx.response.body = 'Not Found';
})

export default router;