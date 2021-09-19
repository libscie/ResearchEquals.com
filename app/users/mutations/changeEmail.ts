import { NotFoundError, resolver } from "blitz"
import db from "db"

export default resolver.pipe(
  // resolver.zod(ChangePassword),
  resolver.authorize(),
  async ({ email }, ctx) => {
    const user = await db.user.findFirst({ where: { id: ctx.session.userId! } })
    if (!user) throw new NotFoundError()

    await db.user.update({
      where: { id: user.id },
      data: { email },
    })

    return true
  }
)
