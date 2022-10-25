import { addMinutes, NotFoundError, resolver } from "blitz"
import db from "db"

import invitationMailer from "../../api/invitation-mailer"

export default resolver.pipe(
  resolver.authorize(),
  async ({ collectionId, workspaceId }: { collectionId: number; workspaceId: number }, ctx) => {
    const nrEditors = await db.collection.findFirst({
      where: {
        id: collectionId,
      },
      include: {
        editors: {
          where: {
            collectionId,
          },
          select: {
            id: true,
          },
        },
        type: true,
      },
    })

    if (nrEditors?.editors.length! >= 5 && nrEditors?.type.type === "COLLABORATIVE")
      throw new Error("Please upgrade if you want to add more editors.")
    const collection = await db.collection.update({
      where: {
        id: collectionId,
      },
      data: {
        editors: {
          createMany: {
            data: [{ workspaceId }],
          },
        },
      },
    })

    return collection
  }
)
