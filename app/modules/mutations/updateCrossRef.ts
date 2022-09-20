import { NotFoundError, resolver } from "blitz"
import db from "db"
import moment from "moment"
import axios from "axios"
import FormData from "form-data"
import { Readable } from "stream"
import generateCrossRefXml from "../../core/crossref/generateCrossRefXml"
import { Cite } from "../../core/crossref/citation_list"
import { isURI, URI } from "../../core/crossref/ai_program"
import submitToCrossRef from "app/core/utils/submitToCrossRef"

export default resolver.pipe(resolver.authorize(), async ({ id }: { id: number }) => {
  const datetime = Date.now()

  // TODO: Can be simplified along with stripe_webhook.ts and publishModule.ts
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

  const xmlData = generateCrossRefXml({
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
                    : authorsRaw!["object"].map(({ given, family, name }) => {
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
    license_url: licenseUrl,
    doi: `${module!.prefix}/${module!.suffix}`,
    resolve_url: resolveUrl,
  })

  await submitToCrossRef({ xmlData, suffix: module!.suffix })

  return true
})
