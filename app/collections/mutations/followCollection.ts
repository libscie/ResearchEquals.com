import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"
import { Ctx } from "blitz"
import CollectionPage from "pages/collections/[suffix]"

const FollowCollection = z.object({
  followedId: z.number(),
  follow: z.boolean(),
})

export default resolver.pipe(
  resolver.zod(FollowCollection),
  resolver.authorize(),
  async ({ followedId, follow }, ctx: Ctx) => {
    // if (follow) {
    //   const collection = await db.workspace.update({
    //     where: { id: ctx.session.$publicData.workspaceId },
    //     data: {
    //       followingCollections: {
    //         connect: {
    //           id: followedId,
    //         },
    //       },
    //     },
    //   })
    // } else {
    //   const collection = await db.workspace.update({
    //     where: { id: ctx.session.$publicData.workspaceId },
    //     data: {
    //       followingCollections: {
    //         disconnect: {
    //           id: followedId,
    //         },
    //       },
    //     },
    //   })
    // }

    if (follow) {
      const collection = await db.collection.update({
        where: { id: followedId },
        data: {
          followers: {
            connect: {
              id: ctx.session.$publicData.workspaceId,
            },
          },
        },
      })
    } else {
      const collection = await db.collection.update({
        where: { id: followedId },
        data: {
          followers: {
            disconnect: {
              id: ctx.session.$publicData.workspaceId,
            },
          },
        },
      })
    }

    return true
  }
)
