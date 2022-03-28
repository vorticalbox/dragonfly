import { oak, z } from "../deps.ts";

export function validation<T extends z.ZodObject<any>>(schema: T) {
  return async function process_request(ctx: oak.Context, next: any) {
    const body = await ctx.request.body({ type: "json" }).value;
    schema.parse(body);
    await next();
  }
}

export default validation;
