import { resolver } from "blitz"
import db from "db"

export default resolver.pipe(
  resolver.authorize(),
  async ({ editorId, active }: { editorId: number; active: boolean }, ctx) => {
    const editorship = await db.editorship.update({
      where: {
        id: editorId,
      },
      data: {
        isActive: active,
      },
    })

    return editorship
  }
)
