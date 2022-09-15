import { resolver } from "blitz"
import db from "db"
import approvalMailer from "../../api/approval-mailer"

export default resolver.pipe(resolver.authorize(), async ({ id, suffix }) => {
  await db.authorship.update({
    where: {
      id,
    },
    data: {
      readyToPublish: true,
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

  await approvalMailer.enqueue(module!.id, {
    id: module!.id.toString(),
  })

  return module!
})
