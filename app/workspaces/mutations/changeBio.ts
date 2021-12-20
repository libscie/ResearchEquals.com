import { resolver } from "blitz"
import db from "db"
import { z } from "zod"
import { Ctx } from "blitz"

const ChangeBio = z.object({
  bio: z.string(),
})

export default resolver.pipe(
  resolver.zod(ChangeBio),
  resolver.authorize(),
  async ({ ...data }, ctx: Ctx) => {
    const workspace = await db.workspace.update({
      where: { id: ctx.session.$publicData.workspaceId },
      data,
    })

    return workspace
  }
)
