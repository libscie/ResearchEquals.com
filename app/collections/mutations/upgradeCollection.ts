import { resolver } from "blitz"
import db from "db"
import { Ctx } from "blitz"

export default resolver.pipe(
  resolver.authorize(),
  async ({ collectionId }: { collectionId: number }, ctx: Ctx) => {
    const collection = await db.collection.update({
      where: {
        id: collectionId,
      },
      data: {
        public: true,
        upgraded: false,
      },
    })

    // TODO: Add CrossRef update

    return true
  }
)
// TODO: Add DOI minting...
