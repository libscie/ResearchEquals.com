const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res) {
  if (!req.query.email || !req.query.price_id || !req.query.suffix) {
    res.status(500).end("Incomplete request")
  } else {
    if (req.method === "POST") {
      try {
        // Create Checkout Sessions from body params.
        const session = await stripe.checkout.sessions.create({
          customer_email: "customer@example.com",
          submit_type: "pay",
          billing_address_collection: "auto",
          line_items: [
            {
              // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
              price: "price_1K98axLmgtJbKHNGBo3BcDFC",
              quantity: 1,
            },
          ],
          mode: "payment",
          success_url: `${req.headers.origin}/?success=true`,
          cancel_url: `${req.headers.origin}/?canceled=true`,
          automatic_tax: { enabled: true },
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
