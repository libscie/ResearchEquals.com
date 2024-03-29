import { resolver } from "@blitzjs/rpc"
import db from "db"
import { Prisma } from "prisma"

export default resolver.pipe(resolver.authorize(), async ({ id, json }) => {
  const currentModule = await db.module.update({
    where: { id },
    data: { main: json as Prisma.JsonObject },
  })

  // Force all authors to reapprove for publishing
  await db.authorship.updateMany({
    where: {
      moduleId: id,
    },
    data: {
      readyToPublish: false,
    },
  })

  const updatedModule = await db.module.findFirst({
    where: { id },
    include: {
      references: {
        include: {
          authors: {
            include: {
              workspace: true,
            },
          },
        },
        orderBy: {
          title: "asc",
        },
      },
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
            orderBy: {
              authorshipRank: "asc",
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
            orderBy: {
              authorshipRank: "asc",
            },
          },
        },
      },
    },
  })

  return updatedModule!
})
