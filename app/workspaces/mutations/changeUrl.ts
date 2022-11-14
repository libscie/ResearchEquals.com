import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"
import algoliasearch from "algoliasearch"
import { Ctx } from "blitz"

const ChangeUrl = z.object({
  url: z.string().url(),
})

const client = algoliasearch(process.env.ALGOLIA_APP_ID!, process.env.ALGOLIA_API_ADMIN_KEY!)
const index = client.initIndex(`${process.env.ALGOLIA_PREFIX}_workspaces`)

export default resolver.pipe(
  resolver.zod(ChangeUrl),
  resolver.authorize(),
  async ({ ...data }, ctx: Ctx) => {
    const workspace = await db.workspace.update({
      where: { id: ctx.session.$publicData.workspaceId },
      data,
    })

    await index.partialUpdateObjects([
      {
        objectID: workspace.id,
        url: workspace.url,
      },
    ])

    return workspace
  }
)
