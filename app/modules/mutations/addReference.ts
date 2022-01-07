import { resolver } from "blitz"
import db from "db"

export default resolver.pipe(resolver.authorize(), async ({ currentId, connectId }) => {
  const module = await db.module.update({
    where: { id: currentId },
    data: {
      references: {
        connect: { id: parseInt(connectId) },
      },
    },
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

  return module
})
