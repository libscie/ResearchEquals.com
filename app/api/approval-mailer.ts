import { sendApproval } from "app/postmark"
import { Queue } from "quirrel/next"
import db from "../../db"

export default Queue("api/approval-mailer", async (moduleId) => {
  const module = await db.module.findFirst({
    where: {
      id: moduleId!,
    },
    include: {
      authors: {
        include: {
          workspace: {
            include: {
              members: {
                include: {
                  user: {
                    select: {
                      emailConsent: true,
                      email: true,
                      emailIsVerified: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  })

  module?.authors.map(async (author) => {
    author.workspace?.members.map(async (member) => {
      if (
        member.emailApprovals &&
        member.user?.emailConsent &&
        member.user.emailIsVerified &&
        author.acceptedInvitation
      ) {
        await sendApproval(
          {
            name: `${author.workspace?.firstName} ${author.workspace?.lastName}`,
            title: module.title,
            url: `${process.env.APP_ORIGIN}/drafts?suffix=${module.suffix}`,
          },
          member.user?.email
        )
      }
    })
  })
})
