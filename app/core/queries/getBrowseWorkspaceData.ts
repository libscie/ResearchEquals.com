import { resolver } from "@blitzjs/rpc"
import { paginate } from "blitz"
import db, { Prisma } from "db"

export default async function getBrowseWorkspaceData({ skip = 0, take = 100 }) {
  const {
    items: workspaces,
    hasMore,
    nextPage,
    count,
  } = await paginate({
    skip,
    take,
    count: () => db.workspace.count({}),
    query: (paginateArgs) =>
      db.workspace.findMany({
        ...paginateArgs,
        orderBy: {
          createdAt: "desc",
        },
      }),
  })

  return {
    workspaces,
    nextPage,
    hasMore,
    count,
  }
}
