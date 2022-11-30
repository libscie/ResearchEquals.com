import { resolver } from "@blitzjs/rpc"
import { Ctx } from "blitz"
import db from "db"

export default resolver.pipe(async () => {
  const collection = await db.collection.findMany({
    where: {
      public: true,
    },
    orderBy: {
      updatedAt: "desc",
    },

    include: {
      submissions: {
        orderBy: {
          updatedAt: "desc",
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

  return collection
})
