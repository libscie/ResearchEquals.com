import { resolver } from "@blitzjs/rpc";
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
      select: {
        collectionId: true,
      },
    })
    const editorshipActive = await db.editorship.findMany({
      where: {
        collectionId: editorship.collectionId,
      },
      select: {
        isActive: true,
      },
    })

    const x = editorshipActive.filter((x) => {
      return x.isActive
    })
    if (x.length === 0) {
      await db.collection.update({
        where: {
          id: editorship.collectionId,
        },
        data: {
          active: false,
        },
      })
    } else {
      await db.collection.update({
        where: {
          id: editorship.collectionId,
        },
        data: {
          active: true,
        },
      })
    }

    return editorship
  }
)
