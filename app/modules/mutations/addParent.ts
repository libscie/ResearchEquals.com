import { resolver } from "blitz"
import db from "db"

export default resolver.pipe(resolver.authorize(), async ({ currentId, connectId }) => {
  const module = await db.module.update({
    where: { id: currentId },
    data: {
      parents: {
        connect: { id: parseInt(connectId) },
      },
    },
    include: {
      authors: {
        include: {
          workspace: true,
        },
      },
      license: true,
      type: true,
      parents: true,
    },
  })

  return module
})
