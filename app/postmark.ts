import { ServerClient, TemplatedMessage } from "postmark"

const from = process.env.MAIL_FROM ?? "ResearchEquals <no-reply@libscie.org>"

export const postmark = () => new ServerClient(process.env.POSTMARK_TOKEN ?? "")

export async function sendEmailWithTemplate(
  to: string,
  templateId: string,
  templateModel: Record<string, string | number>
) {
  const message = new TemplatedMessage(from, templateId, templateModel, to)

  await postmark().sendEmailWithTemplate(message)
}

export async function sendInvitation(to: string, title: string) {
  const message = new TemplatedMessage(from, "invitation-mail", { title }, to)
  message.MessageStream = "broadcast"
  message.ReplyTo = "Chris Hartgerink <ceo@libscie.org>"
  await postmark().sendEmailWithTemplate(message)
}

export async function sendApprovals() {
  await postmark().sendEmail({
    From: "chris@libscie.org",
    To: "chris@libscie.org",
    Subject: "Hello from Postmark2121!!!!!!",
    HtmlBody: "<strong>Hello</strong> dear Postmark user.",
    TextBody: "Hello from Postmark!",
    MessageStream: "broadcast",
  })
}
