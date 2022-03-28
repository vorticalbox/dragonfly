import { oak } from "../deps.ts";
import * as user_service from '../users/user_service.ts'

export async function validate_token(ctx: oak.Context, next: any) {
  const token = ctx.request.headers.get('X-access-token');
  const userDoc = await user_service.verifyToken(token);
  if (!userDoc) {
    ctx.response.status = 401;
    ctx.response.body = 'access denied';
  } else {
    // TODO(@vorticalbox): type this
    // @ts-ignore: middleware adds user to ctx but this is currently not typed
    ctx.user = userDoc;
    await next();
  }
}
