import { api } from "app/blitz-server"
import { NextApiRequest, NextApiResponse } from "next"
import { Ctx } from "blitz"
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY, { apiVersion: "2020-03-02" })
import db, { Prisma } from "db"
import moment from "moment"
import algoliasearch from "algoliasearch"
import { isURI } from "app/core/crossref/ai_program"
import submitToCrossRef from "app/core/utils/submitToCrossRef"
import moduleXml from "app/core/utils/moduleXml"
import cancelSupportingMembership from "./cancel-supporting-membership"
import { supportingSignup, supportingCancel } from "../../app/postmark"
import { getToBePublishedModule } from "../../app/modules/mutations/publishModule"

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

const client = algoliasearch(process.env.ALGOLIA_APP_ID!, process.env.ALGOLIA_API_ADMIN_KEY!)
const index = client.initIndex(`${process.env.ALGOLIA_PREFIX}_modules`)

// Many Thanks to this post 🙏
// https://www.aleksandra.codes/stripe-with-blitz
const getRawData = (req: NextApiRequest): Promise<string> => {
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

const webhook = async (req: NextApiRequest, res: NextApiResponse) => {
  const rawData: string = await getRawData(req)
  let event

  const signature = req.headers["stripe-signature"]
  const datetime = Date.now()

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
      switch (event.data.object.metadata.product) {
        case "collection-type":
          await db.collection.create({
            data: {
              title: "Your title here",
              subtitle: "Your subtitle here",
              suffix: event.data.object.metadata.suffix,
              collectionTypeId: parseInt(event.data.object.metadata.collectionId),
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
                  workspaceId: parseInt(event.data.object.metadata.workspaceId),
                },
              },
            },
          })
          break

        case "collection-upgrade":
          await db.collection.update({
            where: {
              id: parseInt(event.data.object.metadata.collectionId),
            },
            data: {
              collectionTypeId: parseInt(event.data.object.metadata.id),
              upgraded: true,
            },
          })
          break

        case "module-license":
          // TODO: Can be simplified along with publishModule.ts
          const id = parseInt(event.data.object.metadata.module_id)
          const currentModule = await getToBePublishedModule(id)
          if (!currentModule!.main) throw Error("Main file is empty")

          const licenseUrl = currentModule?.license?.url ?? ""
          if (!isURI(licenseUrl)) throw Error("License URL is not a valid URI")

          const resolveUrl = `${process.env.APP_ORIGIN}/modules/${currentModule!.suffix}`
          if (!isURI(resolveUrl)) throw Error("Resolve URL is not a valid URI")

          await submitToCrossRef({
            xmlData: moduleXml({
              currentModule,
              licenseUrl,
              resolveUrl,
            }),
            suffix: currentModule!.suffix,
          })

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
            language: publishedModule.language,
          })
          console.log(
            `[STRIPE WEBHOOK]: Publication complete; type ${event.type}, id: ${event.id}.`,
          )
          break
      }
      break

    // This only happens for supporting memberships
    // if we have other subscriptions this needs to be more precise
    // eg with metadata product types
    case "invoice.payment_succeeded":
      await db.user.update({
        where: {
          email: event.data.object.customer_email,
        },
        data: {
          role: "SUPPORTING",
          supportingMember: true,
          supportingMemberSince: moment(datetime).format(),
          customerId: event.data.object.customer,
        },
      })
      await supportingSignup(event.data.object.customer_email)
      // If it's a sponsored supporter, make sure to cancel the subscription immediately
      // Sponsored memberships last only for a year
      const isSponsored = event.data.object.lines.data[0].metadata.subType === "sponsored"
      if (isSponsored) {
        await stripe.subscriptions.cancel(event.data.object.subscription)
      }

    case "customer.subscription.updated":
      if (event.data.object.cancel_at_period_end) {
        await cancelSupportingMembership.enqueue(event.data.object.customer, {
          runAt: new Date(event.data.object.cancel_at * 1000),
          id: event.data.object.customer,
        })
        const user = await db.user.findFirst({
          where: {
            customerId: event.data.object.customer,
          },
          select: {
            email: true,
          },
        })
        await supportingCancel(
          { cancelAt: moment(event.data.object.cancel_at * 1000).format("MMMM Do YYYY") },
          user!.email,
        )
      } else {
        await cancelSupportingMembership.delete(
          event.data.object.customer, // this is the same ID we set above
        )
      }

    default:
      console.log(`[STRIPE WEBHOOK]: Unhandled event type ${event.type}, id: ${event.id}.`)
  }

  res.statusCode = 200
  res.setHeader("Content-Type", "application/json")
  res.end(JSON.stringify({ event: event.type }))
}

export default api(webhook)

export const config = {
  api: {
    bodyParser: false,
  },
}
