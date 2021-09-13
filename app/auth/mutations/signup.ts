import { resolver, SecurePassword } from "blitz"
import db from "db"
import { Signup } from "app/auth/validations"
import { Role } from "types"
import { sendEmailWithTemplate } from "app/postmark"
import { url } from "app/url"
import * as verifyEmail from "../verify-email"

export default resolver.pipe(resolver.zod(Signup), async ({ email, password, handle }, ctx) => {
  const hashedPassword = await SecurePassword.hash(password.trim())
  const user = await db.user.create({
    data: {
      email: email.toLowerCase().trim(),
      hashedPassword,
      role: "CUSTOMER",
      memberships: {
        create: {
          role: "OWNER",
          workspace: {
            create: {
              handle,
            },
          },
        },
      },
    },
    select: { id: true, name: true, email: true, role: true },
  })

  const emailCode = await verifyEmail.generateCode(hashedPassword)

  await Promise.all([
    sendEmailWithTemplate(email, "welcome", {
      verify_email_url: url`/verifyEmail/${emailCode}`,
    }),
    ctx.session.$create({ userId: user.id, role: user.role as Role }),
  ])

  return user
})
