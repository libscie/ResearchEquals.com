import { Queue } from "quirrel/next"
import db from "../../db"
import { sendInvitation } from "../postmark"

export default Queue("api/invitation-mailer", async (authorshipId: number) => {
  // find authorship with module
  const authorship = await db.authorship.findFirst({
    where: {
      id: authorshipId,
    },
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
  })

  // Send to all members who have consented to receive invitations
  authorship?.workspace?.members.map(async (member) => {
    if (member.emailInvitations && member.user?.emailConsent) {
      await sendInvitation()
    }
  })
})
