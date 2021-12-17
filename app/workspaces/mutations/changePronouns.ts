import { resolver } from "blitz"
import db from "db"
import { z } from "zod"
import algoliasearch from "algoliasearch"
import { Ctx } from "blitz"

const ChangePronouns = z.object({
  pronouns: z.string().min(0).max(20),
})

const client = algoliasearch(process.env.ALGOLIA_APP_ID!, process.env.ALGOLIA_API_ADMIN_KEY!)
const index = client.initIndex(`${process.env.ALGOLIA_PREFIX}_workspaces`)

export default resolver.pipe(
  resolver.zod(ChangePronouns),
  resolver.authorize(),
  async ({ ...data }, ctx: Ctx) => {
    const workspace = await db.workspace.update({
      where: { id: ctx.session.$publicData.workspaceId },
      data,
    })

    await index.partialUpdateObjects([
      {
        objectID: workspace.id,
        pronouns: workspace.pronouns,
      },
    ])

    return workspace
  }
)
