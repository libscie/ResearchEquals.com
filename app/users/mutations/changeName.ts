import { NotFoundError, resolver } from "blitz"
import db from "db"
import algoliasearch from "algoliasearch"

const client = algoliasearch(process.env.ALGOLIA_APP_ID!, process.env.ALGOLIA_API_ADMIN_KEY!)
const index = client.initIndex(`${process.env.ALGOLIA_PREFIX}_workspaces`)

export default resolver.pipe(resolver.authorize(), async ({ name }, ctx) => {
  const user = await db.user.findFirst({ where: { id: ctx.session.userId! } })
  const workspace = await db.workspace.findFirst({ where: { id: ctx.session.workspaceId! } })

  if (!user) throw new NotFoundError()
  if (!workspace) throw new NotFoundError()

  await db.user.update({
    where: { id: user.id },
    data: { name },
  })

  await db.workspace.update({
    where: { id: workspace.id },
    data: { name },
  })

  await index.partialUpdateObjects([
    {
      objectID: workspace.id,
      name: name,
      // handle: membership.workspace.handle,
      // avatar: membership.workspace.avatar,
    },
  ])

  return true
})
