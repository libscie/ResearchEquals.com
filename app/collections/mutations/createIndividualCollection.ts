import { resolver } from "blitz"
import db from "db"
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
      collectionTypeId: collection!.id,
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
