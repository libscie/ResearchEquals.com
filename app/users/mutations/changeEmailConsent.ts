import { resolver } from "@blitzjs/rpc"
import db from "db"
import { Ctx, NotFoundError } from "blitz"

export default resolver.pipe(
  resolver.authorize(),
  async ({ emailConsent, marketingConsent }, ctx: Ctx) => {
    const user = await db.user.findFirst({ where: { id: ctx.session.userId! } })
    if (!user) throw new NotFoundError()

    await db.user.update({
      where: { id: user.id },
      data: { emailConsent, marketingConsent },
    })

    return true
  }
)
