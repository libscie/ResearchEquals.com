import { NotFoundError, resolver } from "blitz"
import db from "db"
import generateSuffix from "./generateSuffix"

export default resolver.pipe(
  resolver.authorize(),
  async ({ title, description, type, main, authors }, ctx) => {
    const authorInvitations = authors.map((author) => {
      return {
        workspaceId: author,
      }
    })

    authorInvitations.push({
      workspaceId: ctx.session.$publicData.workspaceId,
      acceptedInvitation: true,
    })

    const module = await db.module.create({
      data: {
        suffix: await generateSuffix(undefined),
        title,
        description,
        type,
        main,
        authors: {
          create: authorInvitations,
        },
      },
    })

    return true
  }
)
