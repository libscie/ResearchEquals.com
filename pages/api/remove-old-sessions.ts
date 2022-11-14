import db from "db"
import { CronJob } from "quirrel/blitz"
import { subDays } from "date-fns"

export default CronJob(
  "api/remove-old-sessions", // 👈 the route that it's reachable on
  "0 0 * * 0",
  async () => {
    await db.session.deleteMany({
      where: {
        expiresAt: {
          lt: subDays(Date.now(), 3),
        },
      },
    })
  }
)
