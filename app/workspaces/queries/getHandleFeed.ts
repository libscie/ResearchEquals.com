import { resolver } from "@blitzjs/rpc"
import { paginate } from "blitz"
import db from "db"

export default resolver.pipe(async ({ handle, orderBy, skip = 0, take = 100 }, ctx) => {
  const workspace = await db.workspace.findFirst({
    where: { handle },
    include: {
      following: true,
    },
  })

  // 3. match filter list to all modules in query
  const {
    items: modules,
    hasMore,
    nextPage,
    count,
  } = await paginate({
    skip,
    take,
    count: () =>
      db.module.count({
        where: {
          published: true,
          authors: {
            some: {
              workspaceId: {
                in: [workspace!.id],
              },
            },
          },
        },
      }),
    query: (paginateArgs) =>
      db.module.findMany({
        ...paginateArgs,
        where: {
          published: true,
          authors: {
            some: {
              workspaceId: {
                in: [workspace!.id],
              },
            },
          },
        },
        orderBy,
        include: {
          authors: {
            include: { workspace: true },
          },
          type: true,
        },
      }),
  })

  return {
    modules,
    nextPage,
    hasMore,
    count,
  }
})
