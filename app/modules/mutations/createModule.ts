import { resolver } from "blitz"
import db from "db"
import generateSuffix from "./generateSuffix"

export default resolver.pipe(
  resolver.authorize(),
  async ({ title, description, type, main, authors }, ctx) => {
    const authorInvitations = authors.map((author) => {
      return {
        workspaceId: author,
        acceptedInvitation: undefined,
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
        type: {
          // TODO: Add type selector
          connect: { id: 1 },
        },
        license: {
          connect: { id: 1 },
        },
        main,
        authors: {
          create: authorInvitations,
        },
      },
    })

    return true
  }
)
