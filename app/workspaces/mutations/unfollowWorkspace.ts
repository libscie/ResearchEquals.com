import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const FollowWorkspace = z.object({
  followerId: z.number(),
  followedId: z.number(),
})

export default resolver.pipe(
  resolver.zod(FollowWorkspace),
  resolver.authorize(),
  async ({ followerId, followedId, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const workspace = await db.workspace.update({
      where: { id: followerId },
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
