import db from "db"

export default async function getSignature({ session }) {
  const user = await db.user.findFirst({
    where: {
      id: session.userId!,
    },
    select: {
      hashedPassword: false,
      email: true,
      emailIsVerified: true,
      emailConsent: true,
      marketingConsent: true,
      supportingMember: true,
    },
  })

  const workspace = await db.workspace.findFirst({
    where: {
      id: session.workspaceId!,
    },
    include: {
      followers: true,
      following: true,
      authorships: true,
      editorships: true,
      affiliations: {
        include: {
          organization: true,
        },
      },
    },
  })

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
  })

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
  })

  const modules = await db.module.findMany({
    where: {
      published: true,
    },
    orderBy: [
      {
        publishedAt: "desc",
      },
    ],
    include: {
      authors: {
        include: {
          workspace: true,
        },
        orderBy: {
          authorshipRank: "asc",
        },
      },
    },
  })

  const workspaces = await db.workspace.findMany({
    orderBy: [
      {
        createdAt: "desc",
      },
    ],
  })

  return {
    user,
    workspace,
    draftModules,
    invitedModules,
    modules,
    workspaces,
  }
}
