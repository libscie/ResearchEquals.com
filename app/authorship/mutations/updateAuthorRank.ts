import { resolver } from "blitz"
import db from "db"

export default resolver.pipe(resolver.authorize(), async ({ id, rank, suffix }) => {
  await db.authorship.update({
    where: {
      id,
    },
    data: {
      authorshipRank: rank,
    },
  })

  const module = await db.module.findFirst({
    where: {
      suffix,
    },
    include: {
      references: {
        orderBy: {
          title: "asc",
        },
      },
      authors: {
        include: {
          workspace: true,
        },
      },
      license: true,
      type: true,
      parents: {
        include: {
          type: true,
          authors: {
            include: {
              workspace: true,
            },
          },
        },
      },
      children: {
        include: {
          type: true,
          authors: {
            include: {
              workspace: true,
            },
          },
        },
      },
    },
  })

  return module
})
