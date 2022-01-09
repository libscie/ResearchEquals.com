// server.ts
import blitz from "blitz/custom-server"
import { createServer } from "http"

import { parse } from "url"

const { PORT = "3000" } = process.env
const dev = process.env.NODE_ENV !== "production"
const app = blitz({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer((req, res) => {
    // Be sure to pass `true` as the second argument to `url.parse`.
    // This tells it to parse the query portion of the URL.
    const parsedUrl = parse(req.url!, true)

    if (process.env.ALGOLIA_PREFIX !== "local") {
      res.writeHead(301, { Location: "https://" + req.headers["host"] + req.url })
    }

    handle(req, res, parsedUrl)
  }).listen(PORT, () => {
    console.log(`Ready on ${process.env.APP_ORIGIN}`)
  })
})
