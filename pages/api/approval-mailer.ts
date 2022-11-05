import { sendApproval } from "app/postmark"
import { Queue } from "quirrel/next"
import db from "../../db"

export default Queue("api/approval-mailer", async (moduleId: number) => {
  const currentModule = await db.module.findFirst({
    where: {
      id: moduleId,
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

  currentModule?.authors.map(async (author) => {
    author.workspace?.members.map(async (member) => {
      if (
        member.emailApprovals &&
        member.user?.emailConsent &&
        member.user.emailIsVerified &&
        author.acceptedInvitation
      ) {
        await sendApproval(
          {
            // TODO: This name should be checked
            // https://github.com/libscie/ResearchEquals.com/issues/730
            name: `${author.workspace?.firstName} ${author.workspace?.lastName}`,
            title: currentModule.title,
            url: `${process.env.APP_ORIGIN}/drafts?suffix=${currentModule.suffix}`,
          },
          member.user?.email
        )
      }
    })
  })
})