import { resolver } from "@blitzjs/rpc"
import { paginate } from "blitz"
import db, { Prisma } from "db"

interface GetModuleInput
  extends Pick<Prisma.ModuleFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  async ({ where, orderBy, skip = 0, take = 100 }: GetModuleInput, ctx) => {
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
          },
          orderBy: [
            {
              publishedAt: "desc",
            },
          ],
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
  }
)
