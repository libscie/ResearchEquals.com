import { api } from "app/blitz-server"
import { NextApiRequest, NextApiResponse } from "next"
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

const CreateSessionSupporting = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!req.query.email || !req.query.price_id) {
    res.status(500).end("Incomplete request")
  } else {
    if (req.method === "POST" && req.query.price_id && req.query.email) {
      try {
        // Create Checkout Sessions from body params.
        const session = await stripe.checkout.sessions.create({
          customer_email: req.query.email,
          billing_address_collection: "auto",
          line_items: [
            {
              price: req.query.price_id,
              quantity: 1,
            },
          ],
          mode: "subscription",
          allow_promotion_codes: true,
          success_url: `${req.headers.origin}/dashboard?supporting=true`,
          cancel_url: `${req.headers.origin}/dashboard`,
          automatic_tax: { enabled: true },
          tax_id_collection: {
            enabled: true,
          },
        })
        res.status(200).json({ url: session.url })
      } catch (err) {
        res.status(err.statusCode || 500).json(err.message)
      }
    } else {
      res.setHeader("Allow", "POST")
      res.status(405).end("Method Not Allowed")
    }
  }
}

export default api(CreateSessionSupporting)
