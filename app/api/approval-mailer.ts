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
      if (member.emailApprovals && member.user?.emailConsent && author.acceptedInvitation) {
        await sendApproval(
          `${author.workspace?.firstName} ${author.workspace?.lastName}`,
          module.title,
          member.user?.email
        )
      }
    })
  })
})
