import { NotFoundError, resolver } from "blitz"
import db from "db"
import generateSuffix from "./generateSuffix"

export default resolver.pipe(
  resolver.authorize(),
  async ({ title, description, type, main, authors }, ctx) => {
    console.log(authors)
    const module = await db.module.create({
      data: {
        suffix: await generateSuffix(undefined),
        title,
        description,
        type,
        main,
        authors: {
          create: [
            {
              workspaceId: ctx.session.$publicData.workspaceId,
            },
            {
              invitedWorkspaceId: 7,
            },
          ],
        },
      },
    })

    return true
  }
)
