import { resolver } from "blitz"
import db from "db"

export default resolver.pipe(resolver.authorize(), async ({ currentId, disconnectId }) => {
  const module = await db.module.update({
    where: { id: currentId },
    data: {
      parents: {
        disconnect: { id: parseInt(disconnectId) },
      },
    },
    include: {
      references: {
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
