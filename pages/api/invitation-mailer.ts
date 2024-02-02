/* eslint-disable @typescript-eslint/no-floating-promises */
import { sendInvitation } from "app/postmark"
import { Queue } from "quirrel/next"
import db from "../../db"

export default Queue("api/invitation-mailer", async (authorshipId: number) => {
  // find authorship with module
  const authorship = await db.authorship.findFirst({
    where: {
      id: authorshipId,
    },
    include: {
      module: true,
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
  })

  // Send to all members who have consented to receive invitations
  // TODO COLLECTIONS: Add conditional logic to those who CAN accept/decline
  authorship?.workspace?.members.map(async (member) => {
    if (member.emailInvitations && member.user?.emailConsent && member.user.emailIsVerified) {
      await sendInvitation(member.user.email, {
        title: authorship.module.title,
        url: `${process.env.APP_ORIGIN}/invitations?suffix=${authorship.module.suffix}`,
        product_url: process.env.APP_ORIGIN,
        product_name: "ResearchEquals",
        company_name: "Liberate Science GmbH",
      })
    }
  })
})
