import { NotFoundError, resolver } from "blitz"
import db from "db"

export default resolver.pipe(
  resolver.authorize(),
  async ({ authorId, moduleId, authorshipRank }, ctx) => {
    const module = await db.module.update({
      where: {
        id: moduleId,
      },
      data: {
        authors: {
          createMany: {
            data: [
              { workspaceId: parseInt(authorId), acceptedInvitation: undefined, authorshipRank },
            ],
          },
        },
      },
      include: {
        references: {
          include: {
            authors: {
              include: {
                workspace: true,
              },
            },
          },
          orderBy: {
            title: "asc",
          },
        },
        authors: {
          include: {
            workspace: true,
          },
        },
        license: true,
        type: true,
        parents: {
          include: {
            type: true,
            authors: {
              include: {
                workspace: true,
              },
            },
          },
        },
      },
    })

    // Force all authors to reapprove for publishing
    await db.authorship.updateMany({
      where: {
        moduleId,
      },
      data: {
        readyToPublish: false,
      },
    })

    return module
  }
)
