import { addMinutes, NotFoundError, resolver } from "blitz"
import db from "db"

import invitationMailer from "../../api/invitation-mailer"

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

    const createdAuthor = await db.authorship.findFirst({
      where: {
        moduleId,
        workspaceId: parseInt(authorId),
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

    const dateimte = new Date()
    await invitationMailer.enqueue(
      // authorship id
      createdAuthor!.id,
      {
        runAt: addMinutes(dateimte, 1),
        id: createdAuthor?.id.toString(),
      }
    )

    return module
  }
)
