import { resolver, SecurePassword } from "blitz"
import db from "db"
import { Signup } from "app/auth/validations"
import { sendEmailWithTemplate } from "app/postmark"
import { url } from "app/url"
import algoliasearch from "algoliasearch"

import * as verifyEmail from "../verify-email"

const client = algoliasearch(process.env.ALGOLIA_APP_ID!, process.env.ALGOLIA_API_ADMIN_KEY!)
const index = client.initIndex("dev_workspaces")

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
    select: { id: true, name: true, email: true, role: true, memberships: true },
  })

  // TODO: Need to make the object more precise and handle less data
  await index.saveObject(user, { autoGenerateObjectIDIfNotExist: true })
  const emailCode = await verifyEmail.generateCode(hashedPassword)

  await Promise.all([
    sendEmailWithTemplate(email, "welcome", {
      handle: handle,
      days: 14,
      verify_email_url: url`/verifyEmail/${emailCode}`,
    }),
    ctx.session.$create({
      userId: user.id,
      roles: [user.role, user.memberships[0]!.role],
      workspaceId: user.memberships[0]!.workspaceId,
    }),
  ])

  return user
})
