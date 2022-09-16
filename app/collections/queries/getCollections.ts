import { resolver, Ctx, AuthorizationError } from "blitz"
import db from "db"

export default resolver.pipe(resolver.authorize(), async () => {
  const collection = await db.collection.findMany({})

  return collection
})
