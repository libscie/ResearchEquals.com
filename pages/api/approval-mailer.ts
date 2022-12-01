import { sendApproval } from "app/postmark"
import { Queue } from "quirrel/next"
import db, { User } from "../../db"

export default Queue("api/approval-mailer", async (payload: { moduleId: number; user: User }) => {
  const { moduleId, user } = payload
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

  const currentApprover = currentModule?.authors.find((author) => author.workspaceId === user.id)

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
            name: `${currentApprover?.workspace?.firstName} ${currentApprover?.workspace?.lastName}`,
            title: currentModule.title,
            url: `${process.env.APP_ORIGIN}/drafts?suffix=${currentModule.suffix}`,
          },
          member.user?.email
        )
      }
    })
  })
})
