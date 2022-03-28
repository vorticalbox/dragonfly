import { z, oak } from '../deps.ts'
const { helpers } = oak;
const limitSkipSchema = z.object({
  skip: z.number().gte(0).default(0),
  limit: z.number().lte(50).default(20),
});
export function parseQuery(ctx: oak.Context) {
  const { skip, limit } = helpers.getQuery(ctx, { mergeParams: true });
  return limitSkipSchema.parse({
    ...skip && { skip: +skip },
    ...limit && { limit: +limit },
  });
}
export default parseQuery
