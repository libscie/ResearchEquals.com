import { NotFoundError, resolver } from "blitz"
import db from "db"

export default resolver.pipe(resolver.authorize(), async ({ suffix, description }) => {
  await db.module.update({
    where: { suffix },
    data: { description },
  })

  return true
})
