import { resolver } from "@blitzjs/rpc";
import { addMinutes } from "blitz";
import db, { MembershipRole } from "db"

export default resolver.pipe(
  resolver.authorize(),
  async ({ submissionId }: { submissionId: number }, ctx) => {
    const submission = await db.submission.delete({
      where: {
        id: submissionId,
      },
    })

    return submission
  }
)
