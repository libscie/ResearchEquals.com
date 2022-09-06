import { NotFoundError, resolver } from "blitz"
import db from "db"
import { Ctx } from "blitz"

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
