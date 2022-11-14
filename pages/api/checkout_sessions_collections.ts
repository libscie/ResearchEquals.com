import { api } from "app/blitz-server"
import { NextApiRequest, NextApiResponse } from "next"
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)
import db from "db"
import { CollectionTypes } from "db"

const CreateSessionCollection = async (req: NextApiRequest, res: NextApiResponse) => {
  if (
    !req.query.workspaceId ||
    !req.query.collectionType ||
    !req.query.email ||
    !req.query.suffix
  ) {
    res.status(500).end("Incomplete request")
  } else {
    if (req.method === "POST") {
      console.log(JSON.stringify(req.query))
      // find collection price id
      const collection = await db.collectionType.findFirst({
        where: {
          type: req.query.collectionType as CollectionTypes,
        },
      })

      try {
        // Create Checkout Sessions from body params.
        const session = await stripe.checkout.sessions.create({
          customer_email: req.query.email,
          submit_type: "pay",
          billing_address_collection: "auto",
          line_items: [
            {
              price: collection?.price_id,
              quantity: 1,
            },
          ],
          mode: "payment",
          success_url: `${req.headers.origin}/collections/${req.query.suffix}/admin?success=true`,
          cancel_url: `${req.headers.origin}`,
          automatic_tax: { enabled: true },
          payment_intent_data: {
            metadata: {
              description: `Charge for creating a ${req.query.collectionType} collection.`,
              product: "collection-type",
              id: req.query.collectionType,
              collectionId: collection?.id,
              workspaceId: req.query.workspaceId,
              suffix: req.query.suffix,
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

export default api(CreateSessionCollection)
