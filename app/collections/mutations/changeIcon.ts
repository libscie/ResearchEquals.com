import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"
import { Ctx } from "blitz"

export default resolver.pipe(
  resolver.authorize(),
  async ({ id, iconInfo }: { id: number; iconInfo: Prisma.JsonObject }, ctx: Ctx) => {
    await db.collection.update({
      where: {
        id,
      },
      data: {
        icon: iconInfo,
      },
    })
    return true
  }
)
