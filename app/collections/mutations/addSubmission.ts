import { resolver } from "blitz"
import db from "db"

export default resolver.pipe(
  resolver.authorize(),
  async (
    {
      collectionId,
      workspaceId,
      moduleId,
    }: { collectionId: number; workspaceId: number; moduleId: number },
    ctx
  ) => {
    const collection = await db.collection.update({
      where: {
        id: collectionId,
      },
      data: {
        submissions: {
          createMany: {
            data: [{ moduleId, workspaceId }],
          },
        },
      },
    })

    return collection
  }
)
