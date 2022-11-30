import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"
import { Ctx } from "blitz"

export default resolver.pipe(
  resolver.authorize(),
  async ({ id, subtitle }: { id: number; subtitle: string }, ctx: Ctx) => {
    await db.collection.update({
      where: {
        id,
      },
      data: {
        subtitle,
      },
    })

    return true
  }
)
