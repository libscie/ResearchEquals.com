import { resolver } from "blitz"
import db from "db"
import { Ctx } from "blitz"
import { isURI } from "app/core/crossref/ai_program"
import { generateCollectionXml } from "../../core/crossref/generateCrossRefXml"
import submitToCrossRef from "app/core/utils/submitToCrossRef"

export default resolver.pipe(
  resolver.authorize(),
  async ({ collectionId }: { collectionId: number }, ctx: Ctx) => {
    const upgradedCollection = await db.collection.update({
      where: {
        id: collectionId,
      },
      data: {
        public: true,
        upgraded: false,
      },
      include: {
        editors: {
          include: {
            workspace: true,
          },
        },
      },
    })

    const resolveUrl = `${process.env.APP_ORIGIN}/collections/${upgradedCollection.suffix}`

    if (!isURI(resolveUrl)) throw Error("Resolve URL is not a valid URI")
    // Add DOI minting
    const xmlData = generateCollectionXml({
      schema: "5.3.1",
      title: upgradedCollection.title as string,
      subtitle: upgradedCollection.subtitle as string,
      doi: `${process.env.DOI_PREFIX}/${upgradedCollection.suffix}`,
      resolve_url: resolveUrl,
      authors: upgradedCollection.editors.map((editor) => {
        const js = {
          firstName: editor.workspace?.firstName,
          lastName: editor.workspace?.lastName,
          orcid: editor.workspace?.orcid,
        }

        return js
      }),
    })
    await submitToCrossRef({ xmlData, suffix: upgradedCollection.suffix })

    return true
  }
)
