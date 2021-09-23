import { NotFoundError, resolver } from "blitz"
import db from "db"
import generateSuffix from "./generateSuffix"

export default resolver.pipe(resolver.authorize(), async ({ title, type, main }, ctx) => {
  // Create module
  const module = await db.module.create({
    data: {
      suffix: await generateSuffix(),
      title,
      type,
      main,
      authors: {
        connect: [
          {
            id: ctx.session.$publicData.workspaceId,
          },
        ],
      },
    },
  })

  return true
})
