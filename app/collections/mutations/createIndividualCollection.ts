import { resolver } from "blitz"
import db, { Prisma } from "db"
import generateSuffix from "../../modules/mutations/generateSuffix"

export default resolver.pipe(resolver.authorize(), async ({}, ctx) => {
  // Find relevant collection ID
  const collection = await db.collectionType.findFirst({
    where: {
      type: "INDIVIDUAL",
    },
    select: {
      id: true,
    },
  })

  const user = await db.user.findFirst({
    where: {
      id: ctx.session.$publicData.userId,
    },
    select: {
      emailIsVerified: true,
    },
  })

  if (!user?.emailIsVerified) {
    throw Error("Please verify your email first.")
  }

  const workspace = await db.workspace.findFirst({
    where: {
      id: ctx.session.$publicData.workspaceId,
    },
    include: {
      editorships: {
        include: {
          collection: {
            include: {
              type: true,
            },
          },
        },
      },
    },
  })

  workspace?.editorships.map((edits) => {
    if (edits.collection.collectionTypeId === collection?.id) {
      throw Error("Limited to 1 individual collection per workspace")
    }
  })

  let collectionName
  if (workspace?.firstName && workspace.lastName) {
    collectionName = `${workspace?.firstName} ${workspace?.lastName}`
  } else {
    collectionName = workspace?.name || workspace?.handle
  }

  const generatedSuffix = await generateSuffix(6)
  await db.collection.create({
    data: {
      title: `${collectionName}'s collection`,
      suffix: generatedSuffix,
      description: "This collection is still being set up.",
      collectionTypeId: collection!.id,
      public: true,
      icon: {
        cdnUrl: workspace?.avatar,
        originalUrl: workspace?.avatar,
        mimeType: "image",
      } as Prisma.JsonObject,
      header: {
        cdnUrl:
          "https://images.unsplash.com/photo-1663275162414-64dba99065a2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1528&q=80",
        originalUrl:
          "https://images.unsplash.com/photo-1663275162414-64dba99065a2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1528&q=80",
        mimeType: "image",
      } as Prisma.JsonObject,
      editors: {
        create: {
          role: "OWNER",
          workspaceId: ctx.session.$publicData.workspaceId!,
        },
      },
    },
  })

  // Add DOI minting

  return generatedSuffix
})
