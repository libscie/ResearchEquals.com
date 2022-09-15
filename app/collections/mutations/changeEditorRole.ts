import { resolver } from "blitz"
import db, { MembershipRole } from "db"

export default resolver.pipe(
  resolver.authorize(),
  async ({ editorId, role }: { editorId: number; role: MembershipRole }, ctx) => {
    const editorship = await db.editorship.update({
      where: {
        id: editorId,
      },
      data: {
        role,
      },
    })

    return editorship
  }
)
