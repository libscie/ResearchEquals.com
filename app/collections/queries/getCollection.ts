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
  const ownCollections = await db.collection.findFirst({
    where: {
      id: collection!.id,
    },
    include: {
      editors: {
        where: {
          workspaceId: ctx.session.$publicData.workspaceId,
        },
      },
    },
  })
  const pendingSubmissions = await db.submission.findMany({
    where: {
      collectionId: collection!.id,
      accepted: null,
    },
  })
  const contributors = await db.submission.findMany({
    where: {
      accepted: true,
      collectionId: collection!.id,
      NOT: {
        submittedBy: null,
      },
    },
    include: {
      submittedBy: true,
    },
  })
  const isFollowing = await db.collection.findFirst({
    where: {
      id: collection?.id,
    },
    include: {
      followers: {
        where: {
          id: ctx.session.$publicData.workspaceId,
        },
      },
    },
  })
  console.log(isFollowing)

  const isAdmin =
    ownCollections!.editors[0]!.role === "OWNER" || ownCollections!.editors[0]!.role === "ADMIN"

  return {
    collection,
    isAdmin,
    pendingSubmissions,
    contributors,
    isFollowing: isFollowing!.followers.length > 0,
  }
})
