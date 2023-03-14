import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"
import algoliasearch from "algoliasearch"
import axios from "axios"
import { Ctx } from "blitz"

const ChangeAvatar = z.object({
  avatar: z.string(),
})

const client = algoliasearch(process.env.ALGOLIA_APP_ID!, process.env.ALGOLIA_API_ADMIN_KEY!)
const index = client.initIndex(`${process.env.ALGOLIA_PREFIX}_workspaces`)

export default resolver.pipe(
  resolver.zod(ChangeAvatar),
  resolver.authorize(),
  async ({ ...data }, ctx: Ctx) => {
    const workspaceOld = await db.workspace.findFirst({
      where: { id: ctx.session.$publicData.workspaceId },
    })
    const workspace = await db.workspace.update({
      where: { id: ctx.session.$publicData.workspaceId },
      data,
    })

    await index.partialUpdateObjects([
      {
        objectID: workspace.id,
        avatar: workspace.avatar,
      },
    ])

    if (workspaceOld!.avatar) {
      if (workspaceOld!.avatar.match(/ucarecdn/g)) {
        const uuid = /((\w{4,12}-?)){5}/.exec(workspaceOld!.avatar!)![0]
        const datestring = new Date()
        // await axios.delete(`https://api.uploadcare.com/files/${uuid}/`, {
        //   headers: {
        //     "Content-Type": "application/json",
        //     Accept: "application/vnd.uploadcare-v0.5+json",
        //     Date: datestring.toUTCString(),
        //     Authorization: `Uploadcare.Simple ${process.env.UPLOADCARE_PUBLIC_KEY}:${process.env.UPLOADCARE_SECRET_KEY}`,
        //   },
        // })
      }
    }

    return workspace
  }
)
