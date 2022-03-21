import { oak, z } from "./deps.ts";
// controller imports
import posts from './controllers/post.ts';
import user from './controllers/user.ts';

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
router.post('/register', user.register);
router.post('/login', user.login);
router.use(async (ctx, next) => {
  const token = ctx.request.headers.get('X-access-token');
  const userDoc = await user.verifyToken(token);
  if (!userDoc) {
    ctx.response.status = 401;
    ctx.response.body = 'access denied';
  } else {
    // TODO(@vorticalbox): type this
    // @ts-ignore: middleware adds user to ctx but this is currently not typed
    ctx.user = userDoc;
    await next();
  }
})
router.get('/post', posts.getPosts);
router.post('/post', posts.addPost);

router.use((ctx) => {
  ctx.response.status = 404;
  ctx.response.body = 'Not Found';
})

export default router;