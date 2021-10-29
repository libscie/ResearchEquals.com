import { resolver } from "blitz"
import db from "db"
import { z } from "zod"
import algoliasearch from "algoliasearch"
import axios from "axios"

const ChangeAvatar = z.object({
  handle: z.string(),
  avatar: z.string(),
})

const client = algoliasearch(process.env.ALGOLIA_APP_ID!, process.env.ALGOLIA_API_ADMIN_KEY!)
const index = client.initIndex(`${process.env.ALGOLIA_PREFIX}_workspaces`)

export default resolver.pipe(
  resolver.zod(ChangeAvatar),
  resolver.authorize(),
  async ({ handle, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const workspaceOld = await db.workspace.findFirst({ where: { handle } })
    const uuid = /((\w{4,12}-?)){5}/.exec(workspaceOld!.avatar!)![0]
    const workspace = await db.workspace.update({ where: { handle }, data })

    await index.partialUpdateObjects([
      {
        objectID: workspace.id,
        avatar: workspace.avatar,
      },
    ])

    const datestring = new Date()
    await axios.delete(`https://api.uploadcare.com/files/${uuid}/`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/vnd.uploadcare-v0.5+json",
        Date: datestring.toUTCString(),
        Authorization: `Uploadcare.Simple ${process.env.UPLOADCARE_PUBLIC_KEY}:${process.env.UPLOADCARE_SECRET_KEY}`,
      },
    })

    return workspace
  }
)
