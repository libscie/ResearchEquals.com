import { resolver } from "@blitzjs/rpc"
import db from "db"

export default resolver.pipe(
  resolver.authorize(),
  async (
    {
      collectionId,
      editorId,
      moduleId,
    }: { collectionId: number; editorId: number; moduleId: number },
    ctx
  ) => {
    const collection = await db.collection.update({
      where: {
        id: collectionId,
      },
      data: {
        submissions: {
          createMany: {
            data: [{ accepted: true, moduleId, editorshipId: editorId }],
          },
        },
      },
    })

    return collection
  }
)
