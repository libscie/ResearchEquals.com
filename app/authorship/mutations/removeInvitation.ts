import { resolver } from "blitz"
import db from "db"

export default resolver.pipe(resolver.authorize(), async ({ id, suffix }) => {
  const author = await db.authorship.findFirst({
    where: {
      id,
    },
  })

  await db.authorship.delete({
    where: {
      id,
    },
  })

  const module = await db.module.findFirst({
    where: {
      suffix,
    },
    include: {
      references: {
        include: {
          authors: {
            include: {
              workspace: true,
            },
          },
        },
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

  return module!
})
