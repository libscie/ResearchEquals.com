import { resolver } from "blitz"
import db, { MembershipRole } from "db"

export default resolver.pipe(
  resolver.authorize(),
  async ({ editorId, role }: { editorId: number; role: MembershipRole }, ctx) => {
    const oldEditorship = await db.editorship.findFirst({
      where: {
        id: editorId,
      },
      include: {
        collection: {
          include: {
            editors: true,
          },
        },
      },
    })

    let ownerAdmins = 0
    let owners = 0

    for (const element of oldEditorship?.collection.editors!) {
      if (element.role === "OWNER" || element.role === "ADMIN") {
        ownerAdmins += 1
      }
      if (element.role === "OWNER") owners += 1
    }
    // Predict the number of owners and admins after the requested change
    if (role === "OWNER" || role === "ADMIN") ownerAdmins += 1

    // Predict the number of owners after the requested change
    oldEditorship?.collection.editors.forEach((e) => {
      if (e.id === editorId && e.role === "OWNER" && role === "ADMIN") owners -= 1
    })

    if (ownerAdmins === 1) throw new Error("Cannot change your role as last admin or owner.")

    // Throw an error if there will be no owners after the change
    if (owners === 0) throw new Error("There should be at least one owner.")

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
