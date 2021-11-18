import { resolver } from "blitz"
import db from "db"

export default resolver.pipe(resolver.authorize(), async ({ id, suffix }) => {
  const author = await db.authorship.findFirst({
    where: {
      id,
    },
  })

  await db.authorship.delete({
    where: {
      id,
    },
  })

  const module = await db.module.findFirst({
    where: {
      suffix,
    },
    include: {
      authors: {
        include: {
          workspace: true,
        },
      },
      license: true,
      type: true,
    },
  })

  return module!
})
