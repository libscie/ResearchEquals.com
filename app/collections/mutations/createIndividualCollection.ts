import { resolver } from "@blitzjs/rpc";
import db, { Prisma } from "db"
import generateSuffix from "../../modules/mutations/generateSuffix"
import { generateCollectionXml } from "../../core/crossref/generateCrossRefXml"
import { isURI } from "app/core/crossref/ai_program"
import submitToCrossRef from "app/core/utils/submitToCrossRef"

export default resolver.pipe(resolver.authorize(), async ({}, ctx) => {
  if (ctx.session.$publicData.userId === null) throw new Error("Need to log in first")
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

  if (!workspace?.firstName || !workspace.lastName) {
    throw Error("Please add your author names first.")
  }

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
  const createdCollection = await db.collection.create({
    data: {
      title: `${collectionName}'s collection`,
      suffix: generatedSuffix,
      description: "This collection is still being set up.",
      collectionTypeId: collection!.id,
      public: true,
      icon: {
        cdnUrl: "https://ucarecdn.com/89f51e88-ab60-40fe-826d-4e86ed938424/RBadge.svg",
        originalUrl: "https://ucarecdn.com/89f51e88-ab60-40fe-826d-4e86ed938424/RBadge.svg",
        mimeType: "image/svg+xml",
      } as Prisma.JsonObject,
      header: {
        cdnUrl:
          "https://ucarecdn.com/92add952-fe09-469d-91e9-4b86659dfe83/magipatternseamless1663788590153.jpg",
        originalUrl:
          "https://ucarecdn.com/92add952-fe09-469d-91e9-4b86659dfe83/magipatternseamless1663788590153.jpg",
        mimeType: "image/jpeg",
      } as Prisma.JsonObject,
      editors: {
        create: {
          role: "OWNER",
          workspaceId: ctx.session.$publicData.workspaceId!,
        },
      },
    },
    include: {
      editors: {
        include: {
          workspace: true,
        },
      },
    },
  })

  const resolveUrl = `${process.env.APP_ORIGIN}/collections/${createdCollection.suffix}`

  if (!isURI(resolveUrl)) throw Error("Resolve URL is not a valid URI")
  // Add DOI minting
  const xmlData = generateCollectionXml({
    schema: "5.3.1",
    title: createdCollection.title as string,
    subtitle: createdCollection.subtitle as string,
    doi: `${process.env.DOI_PREFIX}/${createdCollection.suffix}`,
    resolve_url: resolveUrl,
    authors: createdCollection.editors.map((editor) => {
      const js = {
        firstName: editor.workspace?.firstName,
        lastName: editor.workspace?.lastName,
        orcid: editor.workspace?.orcid,
      }

      return js
    }),
  })
  await submitToCrossRef({ xmlData, suffix: createdCollection.suffix })

  return generatedSuffix
})
