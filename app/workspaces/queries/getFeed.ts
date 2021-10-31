import { paginate, resolver } from "blitz"
import db, { Prisma } from "db"

interface GetModuleInput
  extends Pick<Prisma.ModuleFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetModuleInput, ctx) => {
    // 1.  get followed workspace ids
    const workspace = await db.workspace.findFirst({
      where: { id: ctx.session.workspaceId },
      include: {
        following: true,
      },
    })
    // 2. create filter list
    const followedWorkspaces = workspace?.following.map((following) => {
      return following.id
    })
    followedWorkspaces?.push(ctx.session.workspaceId!)

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
                  in: followedWorkspaces,
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
                  in: followedWorkspaces,
                },
              },
            },
          },
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
