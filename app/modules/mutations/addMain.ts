import { NotFoundError, resolver } from "blitz"
import db from "db"
import { Prisma } from "prisma"

export default resolver.pipe(resolver.authorize(), async ({ id, json }) => {
  const module = await db.module.update({
    where: { id },
    data: { main: json as Prisma.JsonObject },
  })

  const updatedModule = await db.module.findFirst({
    where: { id },
    include: {
      authors: {
        include: {
          workspace: true,
        },
      },
      license: true,
      type: true,
      parents: {
        include: {
          type: true,
          authors: {
            include: {
              workspace: true,
            },
          },
        },
      },
      children: {
        include: {
          type: true,
          authors: {
            include: {
              workspace: true,
            },
          },
        },
      },
    },
  })

  return updatedModule!
})
