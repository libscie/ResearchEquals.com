import { Ctx } from "blitz"
import db from "db"

export default async function getSupporting(_ = null) {
  const user = await db.user.findMany({
    where: { supportingMember: true },
    select: {
      id: true,
    },
  })

  return user
}
