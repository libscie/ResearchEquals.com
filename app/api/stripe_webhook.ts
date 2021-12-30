import { BlitzApiRequest, BlitzApiResponse, Ctx } from "blitz"
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)
import db from "db"

import moment from "moment"
import algoliasearch from "algoliasearch"

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET
console.log(endpointSecret)
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
      })

    default:
      console.log(`[STRIPE WEBHOOK]: Unhandled event type ${event.type}, id: ${event.id}.`)
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
