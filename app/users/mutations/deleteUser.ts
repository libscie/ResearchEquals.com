import { NotFoundError, resolver } from "blitz"
import db from "db"
import algoliasearch from "algoliasearch"

const client = algoliasearch(process.env.ALGOLIA_APP_ID!, process.env.ALGOLIA_API_ADMIN_KEY!)
const index = client.initIndex(`${process.env.ALGOLIA_PREFIX}_workspaces`)

export default resolver.pipe(resolver.authorize(), async (_, ctx) => {
  const user = await db.user.findFirst({
    where: { id: ctx.session.userId! },
  })
  if (!user) throw new NotFoundError()

  const workspace = await db.workspace.findFirst({
    where: { id: ctx.session.workspaceId },
    include: {
      authorships: true,
    },
  })
  if (!workspace) throw new NotFoundError()

  // TODO: Remove workspace information?
  // TODO: How to deal with multi-member workspaces?

  await db.membership.deleteMany({ where: { userId: ctx.session.userId } })
  if (workspace.authorships.length === 0) {
    await db.workspace.delete({ where: { id: ctx.session.workspaceId } })
    await index.deleteObject(workspace.id.toString())
  }
  await db.session.deleteMany({ where: { userId: ctx.session.userId } })
  await db.user.delete({ where: { id: user.id } })
  await ctx.session.$revoke()
  // For some reason ctx.session.$revokeAll() doesn't delete

  return true
})
