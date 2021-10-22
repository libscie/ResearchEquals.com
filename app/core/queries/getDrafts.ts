import db from "db"

export default async function getSignature({ session }) {
  const draftModules = await db.module.findMany({
    where: {
      published: false,
      authors: {
        some: {
          workspaceId: session.workspaceId,
          acceptedInvitation: true,
        },
      },
    },
    orderBy: [
      {
        updatedAt: "asc",
      },
    ],
  })

  return draftModules
}
