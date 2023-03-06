import { Ctx } from "blitz"
import db from "db"

export default async function getCurrentWorkspace(_ = null, { session }: Ctx) {
  if (!session.workspaceId) return null

  const workspace = await db.workspace.findFirst({
    where: { id: session.workspaceId },
    include: {
      following: true,
      authorships: {
        include: {
          module: true,
        },
      },
      editorships: {
        include: {
          collection: {
            include: {
              type: true,
            },
          },
        },
      },
      affiliations: {
        include: {
          organization: true,
        },
      },
    },
  })

  return workspace
}
