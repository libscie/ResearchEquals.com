import { ServerClient, TemplatedMessage } from "postmark"
import db from "db"

const from = process.env.MAIL_FROM ?? "ResearchEquals <info@libscie.org>"

const postmark = () => new ServerClient(process.env.POSTMARK_TOKEN ?? "")

async function broadcastMessage({ subject, htmlContent, textContent }) {
  const users = await db.user.findMany({
    where: {
      emailIsVerified: true,
    },
  })

  await postmark().sendEmailBatch(
    users.map((user) => {
      return {
        From: from,
        To: user.email,
        Subject: subject,
        HtmlBody: htmlContent,
        TextBody: textContent,
        MessageStream: "broadcast",
      }
    })
  )
}

export default broadcastMessage
