import { resolver } from "@blitzjs/rpc"
import { Ctx } from "blitz"
import db from "db"
import * as z from "zod"

export default resolver.pipe(resolver.authorize(), async (input, ctx: Ctx) => {
  // Only authorize the SUPERADMIN role for this
  ctx.session.$authorize("SUPERADMIN")

  const modules = await db.module.findMany({
    where: {
      published: true,
      publishedWhere: "ResearchEquals",
    },
    include: {
      type: true,
      license: true,
    },
    orderBy: {
      publishedAt: "desc",
    },
  })

  const collections = await db.collection.findMany({
    where: {
      public: true,
    },
  })

  return { modules, collections }
})
