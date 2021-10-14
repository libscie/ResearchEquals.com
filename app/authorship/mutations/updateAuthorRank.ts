import { resolver } from "blitz"
import db from "db"

export default resolver.pipe(resolver.authorize(), async ({ id, rank }) => {
  await db.authorship.update({
    where: {
      id,
    },
    data: {
      authorshipRank: rank,
    },
  })

  return true
})
