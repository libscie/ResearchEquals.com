import { resolver } from "blitz"
import db, { Prisma } from "db"
import generateSuffix from "./generateSuffix"

export default resolver.pipe(
  resolver.authorize(),
  async ({ title, description, typeId, licenseId, authors }, ctx) => {
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
        prefix: process.env.DOI_PREFIX,
        suffix: await generateSuffix(undefined),
        title,
        description,
        type: {
          connect: { id: typeId },
        },
        license: {
          connect: { id: licenseId },
        },
        authors: {
          create: authorInvitations,
        },
      },
    })

    return true
  }
)
