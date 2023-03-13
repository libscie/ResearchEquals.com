import { Queue } from "quirrel/next"
import db from "db"

export default Queue("api/cancel-supporting-membership", async (customer: string) => {
  await db.user.update({
    where: {
      customerId: customer,
    },
    data: {
      supportingMember: false,
      supportingMemberSince: null,
      customerId: null,
    },
  })
})
