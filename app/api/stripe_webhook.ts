import { BlitzApiRequest, BlitzApiResponse, Ctx } from "blitz"
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)
import db from "db"
import axios from "axios"
import convert from "xml-js"
import FormData from "form-data"
import { Readable } from "stream"

import moment from "moment"
import algoliasearch from "algoliasearch"
import generateCrossRefObject from "../core/crossref/generateCrossRefObject"

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET
const datetime = Date.now()

const client = algoliasearch(process.env.ALGOLIA_APP_ID!, process.env.ALGOLIA_API_ADMIN_KEY!)
const index = client.initIndex(`${process.env.ALGOLIA_PREFIX}_modules`)

// Many Thanks to this post 🙏
// https://www.aleksandra.codes/stripe-with-blitz
const getRawData = (req: BlitzApiRequest): Promise<string> => {
  return new Promise((resolve) => {
    let buffer = ""
    req.on("data", (chunk) => {
      buffer += chunk
    })

    req.on("end", () => {
      resolve(Buffer.from(buffer).toString())
    })
  })
}

const webhook = async (req: BlitzApiRequest, res: BlitzApiResponse) => {
  const rawData: string = await getRawData(req)
  let event

  const signature = req.headers["stripe-signature"]
  try {
    event = stripe.webhooks.constructEvent(rawData, signature!, endpointSecret)
  } catch (err) {
    res.statusCode = 400
    res.setHeader("Content-Type", "application/json")
    res.end(JSON.stringify({ error: "Webhook signature verification failed" }))
    return
  }

  // https://www.tutorialsteacher.com/typescript/typescript-switch
  switch (event.type) {
    // only deal with success
    case "payment_intent.succeeded":
      const datetime = Date.now()
      // TODO: Can be simplified along with publishModule.ts
      const module = await db.module.findFirst({
        where: {
          id: parseInt(event.data.object.metadata.module_id),
        },
        include: {
          license: true,
          type: true,
          authors: {
            include: {
              workspace: true,
            },
            orderBy: {
              authorshipRank: "asc",
            },
          },
          references: {
            include: {
              authors: {
                include: {
                  workspace: true,
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

      const publishedModule = await db.module.update({
        where: {
          id: parseInt(event.data.object.metadata.module_id),
        },
        data: {
          published: true,
          publishedAt: moment(datetime).format(),
          publishedWhere: "ResearchEquals",
          url: `https://doi.org/${process.env.DOI_PREFIX}/${event.data.object.metadata.suffix}`,
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
      })
      console.log(`[STRIPE WEBHOOK]: Publication complete; type ${event.type}, id: ${event.id}.`)

    // default:
    // console.log(`[STRIPE WEBHOOK]: Unhandled event type ${event.type}, id: ${event.id}.`)
  }

  res.statusCode = 200
  res.setHeader("Content-Type", "application/json")
  res.end(JSON.stringify({ event: event.type }))
}

export default webhook

export const config = {
  api: {
    bodyParser: false,
  },
}
