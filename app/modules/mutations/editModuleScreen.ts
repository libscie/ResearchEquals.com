import { NotFoundError, resolver } from "blitz"
import db from "db"

export default resolver.pipe(
  resolver.authorize(),
  async ({ id, typeId, title, description, licenseId }) => {
    const module = await db.module.update({
      where: { id },
      data: {
        type: {
          connect: {
            id: typeId,
          },
        },
        title,
        description,
        license: {
          connect: {
            id: licenseId,
          },
        },
      },
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
      where: { id },
      include: {
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
        children: {
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

    return updatedModule!
  }
)
