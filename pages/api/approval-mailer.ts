import { sendApproval } from "app/postmark"
import { Queue } from "quirrel/next"
import db, { Workspace } from "../../db"

export default Queue(
  "api/approval-mailer",
  async (payload: { moduleId: number; workspace: Workspace }) => {
    const { moduleId, workspace } = payload
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
              name: `${workspace.firstName} ${workspace.lastName}`,
              title: currentModule.title,
              url: `${process.env.APP_ORIGIN}/drafts?suffix=${currentModule.suffix}`,
              product_name: "ResearchEquals",
              company_name: "Liberate Science GmbH",
            },
            member.user?.email
          )
        }
      })
    })
  }
)
