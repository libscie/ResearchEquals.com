import { resolver } from "@blitzjs/rpc";
import db, { Prisma } from "db"
import { Ctx } from "blitz"

export default resolver.pipe(
  resolver.authorize(),
  async ({ id, headerInfo }: { id: number; headerInfo: Prisma.JsonObject }, ctx: Ctx) => {
    await db.collection.update({
      where: {
        id,
      },
      data: {
        header: headerInfo,
      },
    })
    return true
  }
)
