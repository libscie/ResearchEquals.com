import { resolver } from "blitz"
import db from "db"
import { z } from "zod"
import algoliasearch from "algoliasearch"

const ChangePronouns = z.object({
  handle: z.string(),
  pronouns: z.string().min(0).max(20),
})

const client = algoliasearch(process.env.ALGOLIA_APP_ID!, process.env.ALGOLIA_API_ADMIN_KEY!)
const index = client.initIndex(`${process.env.ALGOLIA_PREFIX}_workspaces`)

export default resolver.pipe(
  resolver.zod(ChangePronouns),
  resolver.authorize(),
  async ({ handle, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const workspace = await db.workspace.update({ where: { handle }, data })

    await index.partialUpdateObjects([
      {
        objectID: workspace.id,
        pronouns: workspace.pronouns,
        // handle: membership.workspace.handle,
        // avatar: membership.workspace.avatar,
      },
    ])

    return workspace
  }
)
