import { resolver } from "blitz"
import db from "db"
import { Ctx } from "blitz"

export default resolver.pipe(
  resolver.authorize(),
  async ({ collectionId }: { collectionId: number }, ctx: Ctx) => {
    await db.collection.update({
      where: {
        id: collectionId,
      },
      data: {
        public: true,
      },
    })
    return true
  }
)
// TODO: Add DOI minting...
