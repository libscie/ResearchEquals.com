import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const ChangeAvatar = z.object({
  handle: z.string(),
  avatar: z.string(),
})

export default resolver.pipe(
  resolver.zod(ChangeAvatar),
  resolver.authorize(),
  async ({ handle, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const workspace = await db.workspace.update({ where: { handle }, data })

    return workspace
  }
)
