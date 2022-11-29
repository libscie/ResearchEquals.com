import { resolver } from "@blitzjs/rpc"
import { addMinutes } from "blitz"
import db, { MembershipRole } from "db"

export default resolver.pipe(
  resolver.authorize(),
  async ({ editorId }: { editorId: number }, ctx) => {
    const editor = await db.editorship.findFirst({
      where: {
        id: editorId,
      },
    })
    const editorships = await db.editorship.findMany({
      where: {
        collectionId: editor?.collectionId,
      },
    })

    if (editorships.length === 1) throw new Error("Cannot delete last editor.")

    let ownerAdmins = 0
    for (const element of editorships) {
      if (element.role === "OWNER" || element.role === "ADMIN") {
        ownerAdmins += 1
      }
    }
    if (ownerAdmins === 1) throw new Error("Cannot delete last admin or owner.")

    const editorship = await db.editorship.delete({
      where: {
        id: editorId,
      },
    })

    return editorship
  }
)
