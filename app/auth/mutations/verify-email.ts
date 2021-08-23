import { resolver } from "blitz"
import db from "db"
import { verifyCode } from "../verify-email"
import * as z from "zod"

export default resolver.pipe(
  resolver.zod(z.object({ code: z.string() })),
  resolver.authorize(),
  async ({ code }, ctx) => {
    const user = await db.user.findUnique({
      where: { id: ctx.session.userId },
      select: { hashedPassword: true, email: true },
    })
    const { hashedPassword } = user!
    const isValid = await verifyCode(code, hashedPassword)
    if (isValid) {
      await db.user.update({ where: { id: ctx.session.userId }, data: { emailIsVerified: true } })

      return true
    } else {
      return false
    }
  }
)
