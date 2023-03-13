import { resolver } from "@blitzjs/rpc"
import { Ctx } from "blitz"

export default resolver.pipe(resolver.authorize(), async ({}, ctx: Ctx) => {
  // Only authorize the SUPERADMIN role for this
  ctx.session.$authorize(["SUPERADMIN", "SUPPORTING"])

  return {}
})
