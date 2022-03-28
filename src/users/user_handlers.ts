import { CTX } from "../types/oak.ts";
import * as user_service from './user_service.ts';

export async function register({ request, response }:CTX) {
  const body = await request.body({ type: "json" }).value;

  // check if we have this user name
  const found = await user_service.find_user(body.username);
  if (found) {
    response.status = 403;
    response.body = 'Username taken';
  } else {
    await user_service.create_user(body);
    response.body = { message: 'user created' };
  }
}

export async function login({ request, response }:CTX) {
  const { username, password } = await request.body({ type: "json" }).value;

  // check if we have this user name
  const user = await user_service.find_user(username);
  if (!user) {
    response.status = 404;
    response.body = 'user not found';
  } else {
    const valid = await user_service.validate_password(username, password);
    if (!valid) {
      response.status = 403;
      response.body = 'incorrect password';
    }
    response.body = await user_service.create_session(username);
  }
}

export default {
  login,
  register,
}