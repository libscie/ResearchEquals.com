import { resolver } from "blitz"
import db from "db"
import { sendEmailWithTemplate } from "app/postmark"
import { url } from "app/url"
import { Ctx } from "blitz"

import * as verifyEmail from "../verify-email"

export default resolver.pipe(async (_, ctx: Ctx) => {
  const user = await db.user.findFirst({
    where: {
      id: ctx.session.$publicData.userId!,
    },
  })

  const emailCode = await verifyEmail.generateCode(user!.hashedPassword!)

  await Promise.all([
    sendEmailWithTemplate(user!.email!, "welcome", {
      handle: user!.email!,
      days: 14,
      verify_email_url: url`/verifyEmail/${emailCode}`,
    }),
  ])

  return true
})
