import { resolver } from "@blitzjs/rpc"
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

    const currentEditors = oldEditorship?.collection.editors
    // Predict the future state of editors after the requested change
    const futureEditors = currentEditors?.map((editor) =>
      editor.id === editorId ? { ...editor, role } : editor
    )

    // Count the predicted number of owners
    const owners = futureEditors?.filter((e) => e.role === "OWNER").length

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
