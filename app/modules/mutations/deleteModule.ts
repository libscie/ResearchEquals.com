import { resolver } from "@blitzjs/rpc"
import db from "db"

export default resolver.pipe(resolver.authorize(), async ({ id }) => {
  await db.authorship.deleteMany({ where: { moduleId: id } })
  await db.module.delete({
    where: {
      id,
    },
  })

  return true
})
