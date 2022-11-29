import { resolver } from "@blitzjs/rpc"
import db from "db"

export default resolver.pipe(resolver.authorize(), async ({ id, accept }) => {
  // TODO: Add context checking of workspace updating the authorship
  await db.authorship.update({
    where: {
      id,
    },
    data: {
      acceptedInvitation: accept,
    },
  })

  return true
})
