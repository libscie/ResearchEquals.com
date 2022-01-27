import { paginate, resolver } from "blitz"
import db, { Prisma } from "db"

export default async function getBrowseData({ skip = 0, take = 100 }) {
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
        },
      }),
    query: (paginateArgs) =>
      db.module.findMany({
        ...paginateArgs,
        where: {
          published: true,
          prefix: "10.53962",
        },
        orderBy: [
          {
            publishedAt: "desc",
          },
        ],
        include: {
          authors: {
            include: {
              workspace: true,
            },
          },
        },
      }),
  })

  return {
    modules,
    nextPage,
    hasMore,
    count,
  }
}
