import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const ChangeBio = z.object({
  handle: z.string(),
  bio: z.string().min(0).max(300),
})

export default resolver.pipe(
  resolver.zod(ChangeBio),
  resolver.authorize(),
  async ({ handle, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const workspace = await db.workspace.update({ where: { handle }, data })

    return workspace
  }
)
