import { resolver } from "@blitzjs/rpc"
import db from "db"
import approvalMailer from "pages/api/approval-mailer"

export default resolver.pipe(resolver.authorize(), async ({ id, suffix, user }) => {
  await db.authorship.update({
    where: {
      id,
    },
    data: {
      readyToPublish: true,
    },
  })

  const currentModule = await db.module.findFirst({
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
            orderBy: {
              authorshipRank: "asc",
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
            orderBy: {
              authorshipRank: "asc",
            },
          },
        },
      },
    },
  })

  await approvalMailer.enqueue(
    { moduleId: currentModule!.id, user },
    {
      id: currentModule!.id.toString(),
    }
  )

  return currentModule!
})
