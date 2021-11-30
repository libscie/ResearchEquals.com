import db from "db"

export default async function getInvitedModules({ session }) {
  const invitedModules = await db.module.findMany({
    where: {
      published: false,
      authors: {
        some: {
          workspaceId: session.workspaceId,
          acceptedInvitation: null,
        },
      },
    },
    orderBy: [
      {
        updatedAt: "desc",
      },
    ],
    include: {
      type: true,
      authors: {
        include: {
          workspace: true,
        },
      },
    },
  })

  console.log(invitedModules)
  return invitedModules
}
