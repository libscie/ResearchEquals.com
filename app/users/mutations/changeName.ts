import { NotFoundError, resolver } from "blitz"
import db from "db"

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

  return true
})
