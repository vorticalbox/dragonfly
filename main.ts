import { config } from "https://deno.land/x/dotenv@v3.1.0/mod.ts";
import { denodb, oak, z } from './deps.ts'
import { ctx } from './src/types.ts'
//models
import PostModel from "./src/models/post.ts";
import UserModel from './src/models/user.ts';
import SessionModel from './src/models/session.ts';
// controller imports
import posts from './src/controllers/post.ts';
import user from './src/controllers/user.ts';

const env = config();
const port = +env.port || 8080;

const { Database, MongoDBConnector } = denodb;

const connector = new MongoDBConnector({
  uri: env.MONGO_URI,
  database: 'dragonfly',
});

const db = new Database(connector);
db.link([PostModel, UserModel, SessionModel]);
db.sync();


const { Application, Router } = oak;
const router = new Router();
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
    // TODO: type this
    //@ts-ignore
    ctx.user = userDoc;
    await next();
  }
})
router.get('/post', posts.getPosts);
router.post('/post', posts.addPost);

const app = new Application();

// error handling
app.use(async (ctx, next) => {
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
app.use(router.routes());
app.use(router.allowedMethods());
console.log(`Server started on port ${port}`);
await app.listen({ port });