import { resolver } from "@blitzjs/rpc"
import db from "db"
import { Ctx, NotFoundError } from "blitz"

export default resolver.pipe(
  resolver.authorize(),
  async ({ id, invitations, approvals, weeklyDigest, collections }, ctx: Ctx) => {
    const membership = await db.membership.update({
      where: {
        id,
      },
      data: {
        emailInvitations: invitations,
        emailApprovals: approvals,
        emailWeeklyDigest: weeklyDigest,
        emailCollections: collections,
      },
    })
    if (!membership) throw new NotFoundError()

    return true
  }
)
