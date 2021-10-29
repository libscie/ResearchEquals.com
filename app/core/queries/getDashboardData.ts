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
        updatedAt: "asc",
      },
    ],
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
      authors: {
        where: {
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
      },
    },
  })

  // // console.log(workspace)

  // const feedWorkspace = await db.workspace.findMany({
  //   where: {
  //     OR: workspace?.following.map((x) => {
  //       return { id: { equals: x.id } }
  //     }),
  //   },
  //   include: {
  //     authorships: {
  //       include: {
  //         module: true,
  //       },
  //     },
  //   },
  // })

  // const [feedModules] = feedWorkspace.map((workspace) => {
  //   return workspace.authorships
  // })
  // console.log(feedModules)

  const workspaces = await db.workspace.findMany({
    orderBy: [
      {
        createdAt: "desc",
      },
    ],
  })

  const followableWorkspaces = await db.workspace.findMany({
    where: { id: { not: session.workspaceId } },
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
