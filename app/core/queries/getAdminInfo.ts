import { resolver, Ctx } from "blitz"
import db from "db"
import * as z from "zod"

export default resolver.pipe(resolver.authorize(), async (input, ctx: Ctx) => {
  // Only authorize the SUPERADMIN role for this
  ctx.session.$authorize("SUPERADMIN")

  return true
})
