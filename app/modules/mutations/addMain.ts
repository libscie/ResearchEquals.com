import { NotFoundError, resolver } from "blitz"
import db from "db"
import { Prisma } from "prisma"

export default resolver.pipe(resolver.authorize(), async ({ suffix, json }) => {
  const module = await db.module.update({
    where: { suffix },
    data: { main: json as Prisma.JsonObject },
  })

  const updatedModule = await db.module.findFirst({
    where: { suffix },
    include: {
      authors: {
        include: {
          workspace: true,
        },
      },
      license: true,
      type: true,
    },
  })

  return updatedModule!
})
