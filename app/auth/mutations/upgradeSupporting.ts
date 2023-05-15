import { resolver } from "@blitzjs/rpc"
import db from "db"
import { AuthenticationError, Ctx } from "blitz"
import { z } from "zod"

const upgradeSupporting = async (input: any, ctx: Ctx) => {
  const user = await db.user.findFirst({
    where: { id: ctx.session.$publicData.userId as number },
    select: {
      id: true,
      hashedPassword: false,
      role: true,
    },
  })
  if (!user) throw new AuthenticationError()

  await ctx.session.$setPublicData({
    roles: [user.role],
  })

  return user
}

export default upgradeSupporting
