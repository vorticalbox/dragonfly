import { z } from "../deps.ts";
import { CTX } from "../types/oak.ts";

export function validation<T extends z.ZodObject<any>>(schema: T) {
  return async function process_request(ctx: CTX, next: any) {
    const body = await ctx.request.body({ type: "json" }).value;
    schema.parse(body);
    await next();
  }
}

export default validation;
