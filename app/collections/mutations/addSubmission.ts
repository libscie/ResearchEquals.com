import { resolver } from "@blitzjs/rpc"
import db from "db"
import collectionSubmissionMailer from "pages/api/collection-submission-mailer"

export default resolver.pipe(
  resolver.authorize(),
  async (
    {
      collectionId,
      workspaceId,
      moduleId,
    }: { collectionId: number; workspaceId: number; moduleId: number },
    ctx
  ) => {
    const collection = await db.collection.update({
      where: {
        id: collectionId,
      },
      data: {
        submissions: {
          createMany: {
            data: [{ moduleId, workspaceId }],
          },
        },
      },
    })

    const submission = await db.submission.findFirst({
      where: {
        collectionId,
        moduleId,
        workspaceId,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    await collectionSubmissionMailer.enqueue(submission!.id, {
      id: submission!.id.toString(),
    })

    return collection
  }
)
