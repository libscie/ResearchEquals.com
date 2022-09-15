import { resolver } from "blitz"
import db, { Prisma } from "db"
import { Ctx } from "blitz"
import { z } from "zod"

export default resolver.pipe(
  // resolver.zod(z.object({ id: z.number(), comment: z.string().min(1).max(250) }),
  resolver.authorize(),
  async ({ id, comment }: { id: number; comment: string }, ctx: Ctx) => {
    await db.submission.update({
      where: {
        id,
      },
      data: {
        comment,
      },
    })
    return true
  }
)
