import * as scrypt from "https://deno.land/x/scrypt@v2.1.1/mod.ts";
import { z } from '../../deps.ts'
import { oak } from '../../deps.ts';
import User from '../models/user.ts';
import Session from '../models/session.ts'


export interface UserLean {
  _id: string,
  username: string
  password: string
}

interface ctx extends oak.Context {
  user: UserLean
}

const registerSchema = z.object({
  username: z.string()
    .max(150, 'username must not be longer then 50 characters'),
  password: z.string()
    .min(7, 'title must be at least 7 characters long')
})


export async function register({ request, response }: oak.Context) {
  const body = await request.body({ type: "json" }).value;
  const parsedBody = registerSchema.parse(body);

  // check if we have this user name
  const found = await User.where('username', parsedBody.username).all();
  if (found.length > 0) {
    response.status = 403;
    response.body = 'Username taken';
  } else {
    const hash = await scrypt.hash(parsedBody.password);
    await User.create({ username: parsedBody.username, password: hash });
    response.body = { message: 'user created' };
  }
}

export async function login({ request, response }: oak.Context) {
  const body = await request.body({ type: "json" }).value;
  const parsedBody = registerSchema.parse(body);

  // check if we have this user name
  const user = await User.where('username', parsedBody.username).first();
  if (!user) {
    response.status = 404;
    response.body = 'user not found';
  } else {
    const valid = await scrypt.verify(parsedBody.password, user.password as string);
    if (valid) {
      await Session.where('username', parsedBody.username).delete();
      const token = crypto.randomUUID();
      const session = await Session.create({ username: parsedBody.username, token });
      response.body = session;
    } else {
      console.log('nope')
      response.status = 403;
      response.body = 'incorrect password';
    }
  }
}

export async function verifyToken(token: string | null) {
  if (!token) return false;
  const session = await Session.where('token', token).first();
  return User.where('username', session.username as string).first();
}

export function getLoggedInUser(ctx: Record<any, any>): UserLean {
  return ctx.user
}


export default {
  login,
  register,
  verifyToken,
}