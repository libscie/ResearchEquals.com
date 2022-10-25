import db from "db"

const itemCounter = (array, item) =>
  array.flat(Infinity).filter((currentItem) => currentItem == item).length

export default async function getSignature({ session, changeDays }) {
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

  const draftRecent = draftModules.map((draft) => {
    const datetime = new Date()
    const now = datetime.getTime()
    const xTimeAgo = now - changeDays * 24 * 60 * 60 * 1000
    const twoTimeAgo = xTimeAgo - changeDays * 24 * 60 * 60 * 1000
    const draftUpdate = new Date(draft.updatedAt)

    if (xTimeAgo < draftUpdate.getTime()) {
      return "short"
    } else if (twoTimeAgo > draftUpdate.getTime() && xTimeAgo < draftUpdate.getTime()) {
      return "long"
    } else {
      return "-"
    }
  })

  const draftPercentage = Math.round(
    (itemCounter(draftRecent, "short") / itemCounter(draftRecent, "long") - 1) * 100
  )

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

  const invitedRecent = invitedModules.map((draft) => {
    const datetime = new Date()
    const now = datetime.getTime()
    const xTimeAgo = now - changeDays * 24 * 60 * 60 * 1000
    const twoTimeAgo = xTimeAgo - changeDays * 24 * 60 * 60 * 1000
    const draftUpdate = new Date(draft.updatedAt)

    if (xTimeAgo < draftUpdate.getTime()) {
      return "short"
    } else if (twoTimeAgo > draftUpdate.getTime() && xTimeAgo < draftUpdate.getTime()) {
      return "long"
    } else {
      return "-"
    }
  })

  const invitedPercentage = Math.round(
    (itemCounter(invitedRecent, "short") / itemCounter(invitedRecent, "long") - 1) * 100
  )

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

  const myPublishedModules = await db.module.findMany({
    where: {
      published: true,
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
  })

  const modulesRecent = myPublishedModules.map((draft) => {
    const datetime = new Date()
    const now = datetime.getTime()
    const xTimeAgo = now - changeDays * 24 * 60 * 60 * 1000
    const twoTimeAgo = xTimeAgo - changeDays * 24 * 60 * 60 * 1000
    const draftUpdate = new Date(draft.publishedAt!)

    if (xTimeAgo < draftUpdate.getTime()) {
      return "short"
    } else if (twoTimeAgo < draftUpdate.getTime() && xTimeAgo > draftUpdate.getTime()) {
      return "long"
    } else {
      return "-"
    }
  })
  const modulesPercentage = Math.round(
    (itemCounter(modulesRecent, "short") / itemCounter(modulesRecent, "long") - 1) * 100
  )

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
    draftPercentage,
    invitedModules,
    invitedPercentage,
    modules,
    myPublishedModules,
    modulesPercentage,
    workspaces,
    followableWorkspaces,
  }
}
