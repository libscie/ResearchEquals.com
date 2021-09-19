import { NotFoundError, resolver } from "blitz"
import db from "db"

export default resolver.pipe(resolver.authorize(), async ({ name }, ctx) => {
  const user = await db.user.findFirst({ where: { id: ctx.session.userId! } })
  if (!user) throw new NotFoundError()

  await db.user.update({
    where: { id: user.id },
    data: { name },
  })

  return true
})
