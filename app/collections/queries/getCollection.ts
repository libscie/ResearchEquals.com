import { resolver, Ctx, AuthorizationError } from "blitz"
import db from "db"

export default resolver.pipe(resolver.authorize(), async (suffix: string) => {
  const collection = await db.collection.findFirst({
    where: {
      suffix,
    },
    include: {
      type: true,
    },
  })

  return collection
})
