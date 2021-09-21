import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const ChangePronouns = z.object({
  handle: z.string(),
  pronouns: z.string().min(0).max(20),
})

export default resolver.pipe(
  resolver.zod(ChangePronouns),
  resolver.authorize(),
  async ({ handle, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const workspace = await db.workspace.update({ where: { handle }, data })

    return workspace
  }
)
