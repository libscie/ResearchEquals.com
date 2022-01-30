import { resolver } from "blitz"
import db from "db"

export default resolver.pipe(resolver.authorize(), async ({ workspaceId, moduleId }) => {
  await db.authorship.delete({
    where: {
      moduleId_workspaceId: { workspaceId, moduleId },
    },
  })

  const module = await db.module.findFirst({
    where: {
      id: moduleId,
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

  return module!
})
