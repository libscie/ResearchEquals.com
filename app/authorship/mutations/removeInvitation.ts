import { resolver } from "blitz"
import db from "db"

export default resolver.pipe(resolver.authorize(), async ({ id }) => {
  await db.authorship.delete({
    where: {
      id,
    },
  })

  return true
})
