import { NotFoundError, resolver } from "blitz"
import db from "db"

export default resolver.pipe(resolver.authorize(), async ({ suffix, title }) => {
  await db.module.update({
    where: { suffix },
    data: { title }, // force email to be unverified upon change
  })

  return true
})
