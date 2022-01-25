import { resolver } from "blitz"
import db from "db"
import generateSuffix from "./generateSuffix"

export default resolver.pipe(
  resolver.authorize(),
  async ({ title, description, parentId, typeId, licenseId }, ctx) => {
    const authorInvitations = [
      {
        workspaceId: ctx.session.$publicData.workspaceId,
        acceptedInvitation: true,
        authorshipRank: 1,
      },
    ]

    const module = await db.module.create({
      data: {
        prefix: process.env.DOI_PREFIX,
        suffix: await generateSuffix(undefined),
        title: `Next step of: ${title}`,
        description: `New module based on: ${description}`,
        type: {
          connect: { id: typeId },
        },
        license: {
          connect: { id: licenseId },
        },
        parents: {
          connect: {
            id: parentId,
          },
        },
        authors: {
          create: authorInvitations,
        },
      },
    })

    return module.suffix
  }
)
