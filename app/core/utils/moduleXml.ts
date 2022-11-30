import generateCrossRefXml from "../crossref/generateCrossRefXml"
import { Cite } from "../../core/crossref/citation_list"

const moduleXml = ({ currentModule, licenseUrl, resolveUrl }) => {
  const xmlData = generateCrossRefXml({
    schema: "5.3.1",
    type: currentModule!.type!.name,
    title: currentModule!.title,
    language: currentModule!.language,
    authors: currentModule!.authors!.map((author) => {
      const js = {
        firstName: author.workspace?.firstName,
        lastName: author.workspace?.lastName,
        orcid: author.workspace?.orcid,
      }

      return js
    }),
    citations:
      currentModule!.references.length === 0
        ? []
        : currentModule?.references.map(
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
                    : publishedWhere !== "ResearchEquals" && JSON.stringify(authorsRaw) !== "{}"
                    ? authorsRaw!["object"].map(({ given, family, name }) => {
                        const authJs = {
                          name: given && family ? `${given} ${family}` : `${name}`,
                        }

                        return authJs
                      })
                    : [],
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
    abstractText: currentModule!.description!,
    license_url: licenseUrl,
    doi: `${currentModule!.prefix}/${currentModule!.suffix}`,
    resolve_url: resolveUrl,
  })

  return xmlData
}

export default moduleXml
