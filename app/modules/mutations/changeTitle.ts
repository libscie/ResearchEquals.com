import { NotFoundError, resolver } from "blitz"
import db from "db"

export default resolver.pipe(resolver.authorize(), async ({ suffix, title }) => {
  const module = await db.module.update({
    where: { suffix },
    data: { title },
  })

  // Force all authors to reapprove for publishing
  await db.authorship.updateMany({
    where: {
      moduleId: module.id,
    },
    data: {
      readyToPublish: false,
    },
  })

  const updatedModule = await db.module.findFirst({
    where: { suffix },
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

  return updatedModule!
})
