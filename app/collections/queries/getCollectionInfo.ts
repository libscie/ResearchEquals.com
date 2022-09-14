import { resolver, Ctx, AuthorizationError } from "blitz"
import db from "db"

export default resolver.pipe(resolver.authorize(), async (suffix: string, ctx: Ctx) => {
  const collection = await db.collection.findFirst({
    where: {
      suffix,
    },
    include: {
      submissions: {
        include: {
          module: true,
        },
      },
      editors: {
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

  const x = collection?.editors
    .map((editor) => {
      return editor.workspaceId
    })
    .filter((x) => x === ctx.session.$publicData.workspaceId)

  if (x!.length === 0) {
    throw new AuthorizationError()
  }

  return collection
})
