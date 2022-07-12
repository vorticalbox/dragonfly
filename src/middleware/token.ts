import { CTX } from "../types/oak.ts";
import * as user_service from '../users/user_service.ts'
import { UserLean } from "../users/user_types.ts";

export async function validate_token(ctx: CTX, next: any) {
  const token = ctx.request.headers.get('X-access-token');
  const userDoc = await user_service.verify_token(token);
  if (!userDoc) {
    ctx.response.status = 401;
    ctx.response.body = 'access denied';
  } else {
    ctx.state.user = userDoc as unknown as UserLean
    await next();
  }
}
