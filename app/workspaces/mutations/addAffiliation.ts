import { Ctx } from "@blitzjs/next"
import { resolver } from "@blitzjs/rpc"
import db from "db"
import moment from "moment"

export default resolver.pipe(
  resolver.authorize(),
  async (
    { workspaceId, rorId, orgName }: { workspaceId: number; rorId: string; orgName: string },
    ctx: Ctx
  ) => {
    const datetime = Date.now()

    const affiliation = await db.affiliation.create({
      data: {
        startDate: moment(datetime).format(),
        workspace: {
          connect: {
            id: workspaceId,
          },
        },
        organization: {
          connectOrCreate: {
            where: {
              rorId,
            },
            create: {
              rorId: rorId,
              name: orgName,
            },
          },
        },
      },
    })

    return affiliation
  }
)
