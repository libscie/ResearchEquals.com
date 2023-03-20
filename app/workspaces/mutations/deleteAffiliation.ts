import { Ctx } from "@blitzjs/next"
import { resolver } from "@blitzjs/rpc"
import db from "db"
import moment from "moment"

export default resolver.pipe(
  resolver.authorize(),
  async (
    { affiliationId, workspaceId }: { affiliationId: number; workspaceId: number },
    ctx: Ctx
  ) => {
    const datetime = Date.now()

    await db.affiliation.delete({
      where: {
        id: affiliationId,
      },
    })

    const affiliations = await db.affiliation.findMany({
      where: {
        workspaceId: workspaceId,
      },
      include: {
        organization: true,
      },
    })

    return affiliations
  }
)
