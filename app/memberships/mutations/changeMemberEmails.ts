import { NotFoundError, resolver } from "blitz"
import db from "db"
import { Ctx } from "blitz"

export default resolver.pipe(
  resolver.authorize(),
  async ({ id, invitations, approvals, weeklyDigest }, ctx: Ctx) => {
    const membership = await db.membership.update({
      where: {
        id,
      },
      data: {
        emailInvitations: invitations,
        emailApprovals: approvals,
        emailWeeklyDigest: weeklyDigest,
      },
    })
    if (!membership) throw new NotFoundError()

    return true
  }
)
