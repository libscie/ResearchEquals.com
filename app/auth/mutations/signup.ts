import { SecurePassword } from "@blitzjs/auth/secure-password"
import { resolver } from "@blitzjs/rpc"
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
      "admin",
      "browse",
      "coc",
      "collections",
      "dashboard",
      "dpa",
      "drafts",
      "faq",
      "forgot-password",
      "graph",
      "imprint",
      "invitations",
      "login",
      "privacy",
      "reset-password",
      "right-of-withdrawal",
      "stats",
      "security",
      "supporting-member",
      "signup",
      "terms",
    ]

    if (
      forbiddenHandles.filter((forbiddenHandle) => forbiddenHandle === handle.toLowerCase())
        .length > 0 ||
      !handle.match(/^[a-zA-Z0-9_]{1,15}$/g)
    ) {
      throw Error("Handle not allowed. Only letters, numbers, and _ allowed. Max. 15 characters.")
    }
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
                handle: handle.toLowerCase(),
                avatar: `https://eu.ui-avatars.com/api/?rounded=true&background=574cfa&color=ffffff&name=${handle}`,
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
        role: user.role,
        workspaceId: user.memberships[0]!.workspaceId,
      }),
    ])

    return user
  },
)
