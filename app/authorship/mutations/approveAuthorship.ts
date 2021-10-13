import { resolver } from "blitz"
import db from "db"

export default resolver.pipe(resolver.authorize(), async ({ id }) => {
  await db.authorship.update({
    where: {
      id,
    },
    data: {
      readyToPublish: true,
    },
  })

  return true
})
