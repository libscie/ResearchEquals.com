import { resolver } from "blitz"
import db from "db"
import { z } from "zod"
import algoliasearch from "algoliasearch"

const ChangeUrl = z.object({
  handle: z.string(),
  url: z.string().url(),
})

const client = algoliasearch(process.env.ALGOLIA_APP_ID!, process.env.ALGOLIA_API_ADMIN_KEY!)
const index = client.initIndex(`${process.env.ALGOLIA_PREFIX}_workspaces`)

export default resolver.pipe(
  resolver.zod(ChangeUrl),
  resolver.authorize(),
  async ({ handle, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const workspace = await db.workspace.update({ where: { handle }, data })

    await index.partialUpdateObjects([
      {
        objectID: workspace.id,
        url: workspace.url,
      },
    ])

    return workspace
  }
)
