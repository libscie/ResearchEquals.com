import collectionRejectedMailer from "app/api/collection-rejected-mailer"
import { acceptSubmission } from "app/postmark"
import { resolver } from "blitz"
import db from "db"
import collectionAcceptedMailer from "../../api/collection-accepted-mailer"

export default resolver.pipe(
  resolver.authorize(),
  async (
    {
      submissionId,
      editorId,
      acceptedStatus,
    }: { submissionId: number; editorId: number; acceptedStatus: boolean },
    ctx
  ) => {
    const submission = await db.submission.update({
      where: {
        id: submissionId,
      },
      data: {
        accepted: acceptedStatus,
        editorshipId: editorId,
      },
    })

    if (acceptedStatus) {
      await collectionAcceptedMailer.enqueue(submission!.id, {
        id: submission!.id.toString(),
      })
    } else {
      await collectionRejectedMailer.enqueue(submission!.id, {
        id: submission!.id.toString(),
      })
    }

    return submission
  }
)
