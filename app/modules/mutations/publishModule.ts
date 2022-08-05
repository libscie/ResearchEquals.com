import { NotFoundError, resolver } from "blitz"
import db from "db"
import moment from "moment"
import algoliasearch from "algoliasearch"
import axios from "axios"
import convert from "xml-js"
import FormData from "form-data"
import { Readable } from "stream"
import generateCrossRefObject from "../../core/crossref/generateCrossRefObject"
import { Cite } from "app/core/crossref/citation_list"

const client = algoliasearch(process.env.ALGOLIA_APP_ID!, process.env.ALGOLIA_API_ADMIN_KEY!)
const index = client.initIndex(`${process.env.ALGOLIA_PREFIX}_modules`)

export default resolver.pipe(
  resolver.authorize(),
  async ({ id, suffix }: { id: number; suffix: string }) => {
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

    const x = generateCrossRefObject({
      schema: "5.3.1",
      type: module!.type!.name,
      title: module!.title,
      language: module!.language,
      authors: module!.authors!.map((author) => {
        const js = {
          firstName: author.workspace?.firstName,
          lastName: author.workspace?.lastName,
          orcid: author.workspace?.orcid,
        }

        return js
      }),
      citations:
        module!.references.length === 0
          ? []
          : module?.references.map(
              ({ authors, authorsRaw, publishedAt, publishedWhere, suffix, prefix, title }) => {
                const refJs: Cite = {
                  publishedWhere: publishedWhere!,
                  authors:
                    publishedWhere === "ResearchEquals"
                      ? authors.map(({ workspace }) => {
                          const authJs = {
                            name: `${workspace?.firstName} ${workspace?.lastName}`,
                            orcid: `https://orcid.org/${workspace!.orcid}`,
                          }

                          return authJs
                        })
                      : // @ts-expect-error ts-migrate(2339) FIXME: Property 'authors' does not exist on type '{ publishedWhere: string; authors: ... Remove this comment to see the full error message
                        authorsRaw!["object"].map(({ given, family, name }) => {
                          const authJs = {
                            name: given && family ? `${given} ${family}` : `${name}`,
                          }

                          return authJs
                        }),
                  publishedAt: publishedAt!,
                  prefix: prefix!,
                  suffix: suffix!,
                  /**
                   * TODO: Should there be an isbn here?
                   */
                  // isbn: reference.isbn!,
                  title: title,
                }
                return refJs
              }
            ) ?? [],
      abstractText: module!.description!,
      license_url: module!.license!.url,
      doi: `${module!.prefix}/${module!.suffix}`,
      resolve_url: `${process.env.APP_ORIGIN}/modules/${module!.suffix}`,
    })

    const xmlData = convert.js2xml(x)
    const xmlStream = new Readable()
    xmlStream._read = () => {}
    xmlStream.push(xmlData)
    xmlStream.push(null)

    const form = new FormData()
    form.append("operation", "doMDUpload")
    form.append("login_id", process.env.CROSSREF_LOGIN_ID)
    form.append("login_passwd", process.env.CROSSREF_LOGIN_PASSWD)
    form.append("fname", xmlStream, {
      filename: `${module!.suffix}.xml`,
      contentType: "text/xml",
      knownLength: (xmlStream as any)._readableState!.length,
    })

    await axios.post(process.env.CROSSREF_URL!, form, { headers: form.getHeaders() })

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
