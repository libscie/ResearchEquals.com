import { NotFoundError, resolver } from "blitz"
import db from "db"
import { sendEmailWithTemplate } from "app/postmark"
import { url } from "app/url"
import * as verifyEmail from "app/auth/verify-email"
import { Ctx } from "blitz"

export default resolver.pipe(resolver.authorize(), async ({ email }, ctx: Ctx) => {
  const user = await db.user.findFirst({ where: { id: ctx.session.userId! } })
  if (!user) throw new NotFoundError()

  await db.user.update({
    where: { id: user.id },
    data: { email, emailIsVerified: false }, // force email to be unverified upon change
  })

  const emailCode = await verifyEmail.generateCode(user.hashedPassword!)

  // TODO Update template
  await Promise.all([
    sendEmailWithTemplate(email, "welcome", {
      handle: user.email,
      days: 30,
      verify_email_url: url`/verifyEmail/${emailCode}?userId=${user.id}`,
    }),
  ])
  // TODO? Add security email to old email

  return true
})
