const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)
import { BlitzApiRequest, BlitzApiResponse } from "blitz"
import db from "db"
import { CollectionTypes } from "db"

const CreateSessionCollection = async (req: BlitzApiRequest, res: BlitzApiResponse) => {
  if (!req.query.email || !req.query.collectionType || !req.query.collectionId) {
    res.status(500).end("Incomplete request")
  } else {
    if (req.method === "POST") {
      console.log(req.query)
      // find collection price id
      const collection = await db.collectionType.findFirst({
        where: {
          type: req.query.collectionType as CollectionTypes,
        },
      })
      let price_id = collection!.price_id
      if (req.query.oldCollectionType === "COLLABORATIVE") {
        // TODO: Find a better way to manage these price_id's
        if (process.env.ALGOLIA_PREFIX === "production") {
          // This is the production price for COLLAB->COMMUNITY
          price_id = "price_1LiN0mLmgtJbKHNG23YGZ0yA"
        } else {
          // This is the test price for COLLAB->COMMUNITY
          price_id = "price_1LiKxHLmgtJbKHNGn7JHxCDk"
        }
      }

      try {
        // Create Checkout Sessions from body params.
        const session = await stripe.checkout.sessions.create({
          customer_email: req.query.email,
          submit_type: "pay",
          billing_address_collection: "auto",
          line_items: [
            {
              price: price_id,
              quantity: 1,
            },
          ],
          mode: "payment",
          success_url: `${req.headers.origin}/collections/${req.query.suffix}/admin?success=true`,
          cancel_url: `${req.headers.origin}`,
          automatic_tax: { enabled: true },
          payment_intent_data: {
            metadata: {
              description: `Charge for upgrading to a ${req.query.collectionType} collection.`,
              product: "collection-upgrade",
              id: collection?.id,
              collectionId: req.query.collectionId,
            },
          },
          tax_id_collection: {
            enabled: true,
          },
        })
        res.redirect(303, session.url)
      } catch (err) {
        res.status(err.statusCode || 500).json(err.message)
      }
    } else {
      res.setHeader("Allow", "POST")
      res.status(405).end("Method Not Allowed")
    }
  }
}

export default CreateSessionCollection
