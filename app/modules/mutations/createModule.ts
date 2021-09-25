import { NotFoundError, resolver } from "blitz"
import db from "db"
import generateSuffix from "./generateSuffix"

export default resolver.pipe(
  resolver.authorize(),
  async ({ title, description, type, main }, ctx) => {
    const module = await db.module.create({
      data: {
        suffix: await generateSuffix(undefined),
        title,
        description,
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
  }
)
