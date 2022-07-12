import { scrypt } from "../deps.ts";
import User from "./user_model.ts";
import Session from "./user_session_model.ts";
import { CreateUser } from "./user_types.ts";

// find user
export function find_user(username: string) {
  return User.where('username', username).first();
}

export async function create_user(user: CreateUser) {
  const hash = await scrypt.hash(user.password);
  await User.create({ username: user.username, password: hash });
}

export async function validate_password(username: string, password: string): Promise<boolean> {
  const user = await find_user(username);
  return scrypt.verify(password, user.password as string);
}

export async function create_session(username: string) {
  await Session.where('username', username).delete();
  const token = crypto.randomUUID();
  return Session.create({ username: username, token });
}

export async function verify_token(token: string | null) {
  if (!token) return false;
  const session = await Session.where('token', token).first();
  if (!session) return false;
  return User.where('username', session.username as string).first();
}