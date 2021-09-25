import { NotFoundError, resolver } from "blitz"
import db from "db"
import moment from "moment"

export default resolver.pipe(resolver.authorize(), async ({ id }, ctx) => {
  let datetime = Date.now()
  await db.module.update({
    where: {
      id,
    },
    data: {
      published: true,
      publishedAt: moment(datetime).format(),
    },
  })

  return true
})
