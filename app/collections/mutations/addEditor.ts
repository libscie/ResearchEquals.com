import { addMinutes, NotFoundError, resolver } from "blitz"
import db from "db"

import invitationMailer from "../../api/invitation-mailer"

export default resolver.pipe(
  resolver.authorize(),
  async ({ collectionId, workspaceId }: { collectionId: number; workspaceId: number }, ctx) => {
    const collection = await db.collection.update({
      where: {
        id: collectionId,
      },
      data: {
        editors: {
          createMany: {
            data: [{ workspaceId: workspaceId }],
          },
        },
      },
    })

    return collection
  }
)
