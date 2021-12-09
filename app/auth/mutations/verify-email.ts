import { resolver } from "blitz"
import db from "db"
import algoliasearch from "algoliasearch"
import { verifyCode } from "../verify-email"
import * as z from "zod"
import { Ctx } from "blitz"

const client = algoliasearch(process.env.ALGOLIA_APP_ID!, process.env.ALGOLIA_API_ADMIN_KEY!)
const index = client.initIndex(`${process.env.ALGOLIA_PREFIX}_workspaces`)

export default resolver.pipe(
  resolver.zod(z.object({ code: z.string() })),
  resolver.authorize(),
  async ({ code }, ctx: Ctx) => {
    const user = await db.user.findUnique({
      where: { id: ctx.session.userId! },
      include: {
        memberships: {
          include: {
            workspace: true,
          },
        },
      },
    })
    const { hashedPassword } = user!

    const isValid = await verifyCode(code, hashedPassword)
    if (isValid) {
      await db.user.update({ where: { id: ctx.session.userId! }, data: { emailIsVerified: true } })

      user!.memberships!.map(async (membership) => {
        await index.saveObject({
          objectID: membership.workspace.id,
          name: membership.workspace.name,
          handle: membership.workspace.handle,
          avatar: membership.workspace.avatar,
          pronouns: membership.workspace.pronouns,
        })
      })

      return true
    } else {
      return false
    }
  }
)
