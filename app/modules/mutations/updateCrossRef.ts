import { NotFoundError, resolver } from "blitz"
import db from "db"
import moment from "moment"
import axios from "axios"
import convert from "xml-js"
import FormData from "form-data"
import { Readable } from "stream"
import generateCrossRefObject from "../../core/crossref/generateCrossRefObject"

export default resolver.pipe(resolver.authorize(), async ({ id }) => {
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

  const x = generateCrossRefObject({
    schema: "5.3.1",
    type: module!.type!.name,
    title: module!.title,
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
        : module?.references.map((reference) => {
            const refJs = {
              publishedWhere: reference.publishedWhere,
              authors:
                reference.publishedWhere === "ResearchEquals"
                  ? reference.authors.map((author) => {
                      const authJs = {
                        name: `${author.workspace?.firstName} ${author.workspace?.lastName}`,
                        orcid: `https://orcid.org/${author!.workspace!.orcid}`,
                      }

                      return authJs
                    })
                  : reference!.authorsRaw!["object"].map((author) => {
                      const authJs = {
                        name:
                          author.given && author.family
                            ? `${author.given} ${author.family}`
                            : `${author.name}`,
                      }

                      return authJs
                    }),
              publishedAt: reference.publishedAt,
              prefix: reference.prefix,
              suffix: reference.suffix,
              isbn: reference.isbn,
              title: reference.title,
            }
            return refJs
          }),
    abstractText: module!.description,
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

  return true
})
