import { addMinutes, NotFoundError, resolver } from "blitz"
import db, { MembershipRole } from "db"

export default resolver.pipe(
  resolver.authorize(),
  async ({ editorId }: { editorId: number }, ctx) => {
    // TODO: throw if only one editorship left
    const editorship = await db.editorship.delete({
      where: {
        id: editorId,
      },
    })

    return editorship
  }
)
