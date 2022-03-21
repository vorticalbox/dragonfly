import { config } from "https://deno.land/x/dotenv@v2.0.0/mod.ts";
import { denodb, oak } from './deps.ts'
import router from './router.ts';
//models
import PostModel from "./models/post.ts";
import UserModel from './models/user.ts';
import SessionModel from './models/session.ts';

const { Application } = oak;
// @ts-ignore Deno.dev does not have readFileSync
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
db.link([PostModel, UserModel, SessionModel]);
db.sync();

const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());
console.log(`Server started on port ${port}`);
await app.listen({ port });