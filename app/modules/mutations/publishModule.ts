import { resolver } from "@blitzjs/rpc"
import db from "db"
import moment from "moment"
import algoliasearch from "algoliasearch"
import { isURI } from "../../core/crossref/ai_program"
import submitToCrossRef from "app/core/utils/submitToCrossRef"
import moduleXml from "../../core/utils/moduleXml"

const client = algoliasearch(process.env.ALGOLIA_APP_ID!, process.env.ALGOLIA_API_ADMIN_KEY!)
const index = client.initIndex(`${process.env.ALGOLIA_PREFIX}_modules`)

export default resolver.pipe(
  resolver.authorize(),
  async ({ id, suffix }: { id: number; suffix?: string }) => {
    const datetime = Date.now()

    // TODO: Can be simplified along with stripe_webhook.ts
    const module = await db.module.findFirst({
      where: {
        id,
      },
      include: {
        license: true,
        type: true,
        authors: {
          include: {
            workspace: true,
          },
        },
        references: {
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
        },
      },
    })

    if (!module!.main) throw Error("Main file is empty")

    const licenseUrl = module?.license?.url ?? ""
    if (!isURI(licenseUrl)) throw Error("License URL is not a valid URI")

    const resolveUrl = `${process.env.APP_ORIGIN}/modules/${module!.suffix}`

    if (!isURI(resolveUrl)) throw Error("Resolve URL is not a valid URI")

    await submitToCrossRef({
      xmlData: moduleXml({
        module,
        licenseUrl,
        resolveUrl,
      }),
      suffix: module!.suffix,
    })

    const publishedModule = await db.module.update({
      where: {
        id,
      },
      data: {
        published: true,
        publishedAt: moment(datetime).format(),
        publishedWhere: "ResearchEquals",
        url: `https://doi.org/${process.env.DOI_PREFIX}/${module!.suffix}`,
      },
      include: {
        license: true,
        type: true,
      },
    })

    await index.saveObject({
      objectID: publishedModule.id,
      doi: `${process.env.DOI_PREFIX}/${publishedModule.suffix}`,
      suffix: publishedModule.suffix,
      license: publishedModule.license?.url,
      type: publishedModule.type.name,
      // It's called name and not title to improve Algolia search
      name: publishedModule.title,
      description: publishedModule.description,
      publishedAt: publishedModule.publishedAt,
      displayColor: publishedModule.displayColor,
      language: publishedModule.language,
    })

    return true
  }
)
