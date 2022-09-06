import { Queue } from "quirrel/next"
import db from "../../db"
import { sendInvitation } from "../postmark"

export default Queue("api/invitation-mailer", async (authorshipId: number) => {
  // find authorship with module
  const authorship = await db.authorship.findFirst({
    where: {
      id: authorshipId,
    },
  })
  // send email
  await sendInvitation()
})
