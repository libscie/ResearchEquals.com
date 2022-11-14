import { resolver } from "@blitzjs/rpc";
import db from "db"
import { isURI } from "../../core/crossref/ai_program"
import submitToCrossRef from "app/core/utils/submitToCrossRef"
import { generateCollectionXml } from "../../core/crossref/generateCrossRefXml"

export default resolver.pipe(resolver.authorize(), async ({ id }: { id: number }) => {
  const datetime = Date.now()

  // TODO: Can be simplified along with stripe_webhook.ts and publishModule.ts
  const collection = await db.collection.findFirst({
    where: {
      id,
    },
    include: {
      editors: {
        include: {
          workspace: true,
        },
      },
    },
  })

  const resolveUrl = `${process.env.APP_ORIGIN}/collections/${collection!.suffix}`

  if (!isURI(resolveUrl)) throw Error("Resolve URL is not a valid URI")
  // Add DOI minting
  const xmlData = generateCollectionXml({
    schema: "5.3.1",
    title: collection!.title as string,
    subtitle: collection!.subtitle as string,
    doi: `${process.env.DOI_PREFIX}/${collection!.suffix}`,
    resolve_url: resolveUrl,
    authors: collection!.editors.map((editor) => {
      const js = {
        firstName: editor.workspace?.firstName,
        lastName: editor.workspace?.lastName,
        orcid: editor.workspace?.orcid,
      }

      return js
    }),
  })
  await submitToCrossRef({ xmlData, suffix: collection!.suffix })
  return true
})
