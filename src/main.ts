import { config } from "https://deno.land/x/dotenv@v2.0.0/mod.ts";
import { denodb, oak, RateLimiter } from './deps.ts'
import router from './router.ts';
//models
import PostModel from "./posts/post_model.ts";
import UserModel from './users/user_model.ts';
import SessionModel from './users/user_session.ts';
import CommentModel from './comments/comment_model.ts';

const { Application } = oak;
// @ts-ignore Deno.dev does not have readFileSync so don't load from .env file
if (Deno.readFileSync) {
  config({ export: true });
}
const env = Deno.env.toObject();
if (!env.MONGO_URI) {
  throw Error('mongo uri missing');
}
const port = +env.port || 8080;

const { Database, MongoDBConnector } = denodb;

const connector = new MongoDBConnector({
  uri: env.MONGO_URI,
  database: 'dragonfly',
});

const db = new Database(connector);
db.link([PostModel, UserModel, SessionModel, CommentModel]);
db.sync();

const app = new Application();
const rateLimit = RateLimiter({
  windowMs: 1000, // Window for the requests that can be made in miliseconds.
  max: 10, // Max requests within the predefined window.
  headers: true, // Default true, it will add the headers X-RateLimit-Limit, X-RateLimit-Remaining.
  message: "Too many requests, please try again later.", // Default message if rate limit reached.
  statusCode: 429, // Default status code if rate limit reached.
});
app.use(rateLimit);
app.use(router.routes());
app.use(router.allowedMethods());
app.addEventListener('listen', () => {
  console.log(`Listening on localhost:${port}`);
});
await app.listen({ port });