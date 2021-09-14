import { Ctx } from "blitz"
import db from "db"

export default async function getCurrentWorkspace(_ = null, { session }: Ctx) {
  if (!session.workspaceId) return null

  const user = await db.workspace.findFirst({
    where: { id: session.workspaceId },
  })

  return user
}
