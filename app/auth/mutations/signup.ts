import { resolver, SecurePassword } from "blitz"
import db from "db"
import { Signup } from "app/auth/validations"
import { sendEmailWithTemplate } from "app/postmark"
import { url } from "app/url"
import algoliasearch from "algoliasearch"
import { Ctx } from "blitz"

import * as verifyEmail from "../verify-email"

const client = algoliasearch(process.env.ALGOLIA_APP_ID!, process.env.ALGOLIA_API_ADMIN_KEY!)
const index = client.initIndex(`${process.env.ALGOLIA_PREFIX}_workspaces`)

export default resolver.pipe(
  resolver.zod(Signup),
  async ({ email, password, handle }, ctx: Ctx) => {
    // This prevents people registering handles that are also page routes
    const forbiddenHandles = [
      "404",
      "browse",
      "coc",
      "dashboard",
      "dpa",
      "drafts",
      "faq",
      "forgot-password",
      "imprint",
      "invitations",
      "login",
      "privacy",
      "reset-password",
      "right-of-withdrawal",
      "security",
      "signup",
      "terms",
    ]

    if (
      forbiddenHandles.filter((forbiddenHandle) => forbiddenHandle === handle.toLowerCase())
        .length > 0
    ) {
      throw Error("Handle not allowed")
    }
    const hashedPassword = await SecurePassword.hash(password.trim())
    const hexColor = Math.floor(Math.random() * 16777215).toString(16)
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
                handle: handle.toLowerCase(),
                avatar: `https://eu.ui-avatars.com/api/?rounded=true&background=${hexColor}&name=${handle}`,
              },
            },
          },
        },
      },
      include: {
        memberships: {
          include: {
            workspace: true,
          },
        },
      },
    })

    const emailCode = await verifyEmail.generateCode(hashedPassword)

    await Promise.all([
      sendEmailWithTemplate(email, "welcome", {
        handle: handle,
        days: 30,
        verify_email_url: url`/verifyEmail/${emailCode}?userId=${user.id}`,
      }),
      ctx.session.$create({
        userId: user.id,
        roles: [user.role, user.memberships[0]!.role],
        workspaceId: user.memberships[0]!.workspaceId,
      }),
    ])

    return user
  }
)
