import { resolver } from "@blitzjs/rpc";
import db, { Prisma } from "db"
import generateSuffix from "./generateSuffix"

export default resolver.pipe(
  resolver.authorize(),
  async ({ title, description, typeId, licenseId, authors, language, displayColor }, ctx) => {
    const authorInvitations = authors.map((author) => {
      return {
        workspaceId: author,
        acceptedInvitation: undefined,
      }
    })

    authorInvitations.push({
      workspaceId: ctx.session.$publicData.workspaceId,
      acceptedInvitation: true,
      authorshipRank: 0,
    })

    const module = await db.module.create({
      data: {
        prefix: process.env.DOI_PREFIX,
        suffix: await generateSuffix(undefined),
        displayColor,
        title,
        description,
        language,
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

    return module.suffix
  }
)
