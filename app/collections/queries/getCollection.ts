import { resolver } from "@blitzjs/rpc"
import { Ctx } from "blitz"
import db from "db"

export default resolver.pipe(async (suffix: string, ctx: Ctx) => {
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
    select: {
      submittedBy: true,
    },
  })
  const uniqContributors = contributors.filter((value, index) => {
    const _value = JSON.stringify(value)
    return (
      index ===
      contributors.findIndex((obj) => {
        return JSON.stringify(obj) === _value
      })
    )
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

  let isAdmin = false
  if (ctx.session.$publicData.workspaceId) {
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
    if (ownCollections!.editors.length > 0) {
      isAdmin =
        ownCollections!.editors[0]!.role === "OWNER" || ownCollections!.editors[0]!.role === "ADMIN"
    }
  }

  return {
    collection,
    isAdmin,
    pendingSubmissions,
    contributors: uniqContributors,
    isFollowing: isFollowing!.followers.length > 0,
  }
})
