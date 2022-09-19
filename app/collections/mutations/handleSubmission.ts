import { resolver } from "blitz"
import db from "db"

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

    return submission
  }
)
