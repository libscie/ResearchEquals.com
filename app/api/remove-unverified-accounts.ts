import db from "db"
import { CronJob } from "quirrel/blitz"
import { subDays } from "date-fns"

export default CronJob(
  "api/remove-unverified-accounts", // 👈 the route that it's reachable on
  "0 0 1 * *",
  async () => {
    const users = await db.user.findMany({
      where: {
        createdAt: {
          lt: subDays(Date.now(), 30),
        },
        updatedAt: {
          lt: subDays(Date.now(), 30),
        },
        emailIsVerified: false,
      },
      include: {
        memberships: {
          include: {
            workspace: {
              include: {
                authorships: true,
              },
            },
          },
        },
      },
    })

    users.map(async (user) => {
      // delete memberships
      await db.membership.deleteMany({
        where: {
          userId: user.id,
        },
      })
      // delete sessions
      await db.session.deleteMany({
        where: {
          userId: user.id,
        },
      })
      // delete user
      await db.user.delete({
        where: {
          id: user.id,
        },
      })
    })

    //  TODO: Remove workspaces without memberships and authorships
  }
)
