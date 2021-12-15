import { NotFoundError, resolver } from "blitz"
import db from "db"

export default resolver.pipe(async ({ email }) => {
  await db.releaseList.create({
    data: {
      email,
    },
  })
  return true
})
