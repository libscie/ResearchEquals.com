import { resolver, Ctx, AuthorizationError } from "blitz"
import db from "db"

export default resolver.pipe(resolver.authorize(), async (suffix: string, ctx: Ctx) => {
  const collection = await db.collection.findFirst({
    where: {
      suffix,
    },
    include: {
      submissions: {
        orderBy: {
          updatedAt: "desc",
        },
        include: {
          submittedBy: true,
          module: true,
          editor: {
            include: {
              workspace: true,
            },
          },
        },
      },
      editors: {
        orderBy: {
          id: "asc",
        },
        include: {
          workspace: {
            include: {
              members: {
                include: {
                  user: {
                    select: {
                      id: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
      type: true,
    },
  })

  const x = collection?.editors.filter((x) => {
    return x.workspaceId === ctx.session.$publicData.workspaceId
  })

  if (x!.length === 0) {
    throw new AuthorizationError()
  }

  return {
    collection,
    editorIdSelf: x![0]!.id,
    editorIsAdmin: x![0]!.role === "OWNER" || x![0]!.role === "ADMIN",
  }
})
