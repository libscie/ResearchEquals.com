import { paginate, resolver } from "blitz"
import db, { Prisma } from "db"

interface GetModuleInput
  extends Pick<Prisma.ModuleFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetModuleInput) => {
    const {
      items: modules,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.module.count({ where }),
      query: (paginateArgs) =>
        db.module.findMany({
          ...paginateArgs,
          where,
          orderBy,
          include: {
            authors: {
              include: { workspace: true },
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
)
