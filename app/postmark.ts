import { ServerClient, TemplatedMessage } from "postmark"
let postmark = require("postmark")
import termsPoison from "./core/utils/markdown"

const from = process.env.MAIL_FROM ?? "ResearchEquals <no-reply@libscie.org>"

export const postmarker = () => new ServerClient(process.env.POSTMARK_TOKEN ?? "")

export async function sendEmailWithTemplate(
  to: string,
  templateId: string,
  templateModel: Record<string, string | number>
) {
  const message = new TemplatedMessage(from, templateId, templateModel, to)

  await postmarker().sendEmailWithTemplate(message)
}

export async function sendInvitation(to: string, data: Object) {
  const message = new TemplatedMessage(from, "invitation-mail", data, to)
  message.MessageStream = "broadcast"
  message.ReplyTo = "Chris Hartgerink <ceo@libscie.org>"
  await postmarker().sendEmailWithTemplate(message)
}

export async function sendApproval(data: Object, to: string) {
  const message = new TemplatedMessage(from, "approval-mail", data, to)
  message.MessageStream = "broadcast"
  message.ReplyTo = "Chris Hartgerink <ceo@libscie.org>"
  await postmarker().sendEmailWithTemplate(message)
}

export async function sendDigest(data: Object, to: string) {
  const message = new TemplatedMessage(from, "weekly-digest-1", data, to)
  message.MessageStream = "broadcast"
  message.ReplyTo = "Chris Hartgerink <ceo@libscie.org>"
  await postmarker().sendEmailWithTemplate(message)
}

export async function sendCollectionSubmission(data: Object, to: string) {
  const message = new TemplatedMessage(from, "collection-submission", data, to)
  message.MessageStream = "broadcast"
  message.ReplyTo = "Chris Hartgerink <ceo@libscie.org>"
  await postmarker().sendEmailWithTemplate(message)
}

export async function acceptSubmission(data: Object, to: string) {
  const message = new TemplatedMessage(from, "submission-accepted", data, to)
  message.MessageStream = "broadcast"
  message.ReplyTo = "Chris Hartgerink <ceo@libscie.org>"
  await postmarker().sendEmailWithTemplate(message)
}

export async function rejectSubmission(data: Object, to: string) {
  const message = new TemplatedMessage(from, "submission-rejected", data, to)
  message.MessageStream = "broadcast"
  message.ReplyTo = "Chris Hartgerink <ceo@libscie.org>"
  await postmarker().sendEmailWithTemplate(message)
}

export async function supportingSignup(to: string) {
  const message = new TemplatedMessage(from, "supporting-signup", {}, to)
  const attachment1 = new postmark.Models.Attachment(
    "terms-and-poison-pill.md",
    Buffer.from(termsPoison()).toString("base64"),
    "text"
  )
  message.Attachments = [attachment1]
  message.ReplyTo = "Chris Hartgerink <ceo@libscie.org>"
  await postmarker().sendEmailWithTemplate(message)
}

export async function supportingCancel(data: Object, to: string) {
  const message = new TemplatedMessage(from, "supporting-cancel", data, to)
  message.ReplyTo = "Chris Hartgerink <ceo@libscie.org>"
  await postmarker().sendEmailWithTemplate(message)
}
