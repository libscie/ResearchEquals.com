import { resolver } from "blitz"
import db from "db"
import { z } from "zod"
import { Ctx } from "blitz"

const FollowWorkspace = z.object({
  followedId: z.number(),
})

export default resolver.pipe(
  resolver.zod(FollowWorkspace),
  resolver.authorize(),
  async ({ followedId, ...data }, ctx: Ctx) => {
    const workspace = await db.workspace.update({
      where: { id: ctx.session.$publicData.workspaceId },
      data: {
        following: {
          disconnect: [
            {
              id: followedId,
            },
          ],
        },
      },
    })

    return workspace
  }
)
