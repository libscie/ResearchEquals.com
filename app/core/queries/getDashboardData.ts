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
    },
  })

  const workspace = await db.workspace.findFirst({
    where: {
      id: session.workspaceId!,
    },
    include: {
      following: true,
      authorships: true,
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
        where: {
          workspaceId: session.workspaceId,
          acceptedInvitation: null,
        },
        include: {
          workspace: true,
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

  const followableWorkspaces = await db.workspace.findMany({
    where: {
      id: { not: { in: [session.workspaceId, ...workspace?.following.map((x) => x.id)!] } },
    },
    take: 5,
    skip: Math.max(0, Math.floor(Math.random() * workspaces.length) - 5),
  })

  return {
    user,
    workspace,
    draftModules,
    invitedModules,
    modules,
    workspaces,
    followableWorkspaces,
  }
}
