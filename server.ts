// server.ts
import blitz from "blitz/custom-server"
import http from "http"
import https from "https"

import { parse } from "url"

const { PORT = "3000" } = process.env
const dev = process.env.NODE_ENV !== "production"
const app = blitz({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  https
    .createServer((req, res) => {
      // Be sure to pass `true` as the second argument to `url.parse`.
      // This tells it to parse the query portion of the URL.
      const parsedUrl = parse(req.url!, true)

      handle(req, res, parsedUrl)
    })
    .listen(PORT, () => {
      console.log(`Ready on ${process.env.APP_ORIGIN}`)
    })

  http
    .createServer((req, res) => {
      // Be sure to pass `true` as the second argument to `url.parse`.
      // This tells it to parse the query portion of the URL.
      const parsedUrl = parse(req.url!, true)

      if (process.env.ALGOLIA_PREFIX !== "local") {
        res.writeHead(301, { Location: "https://" + req.headers["host"] + req.url })
      }

      handle(req, res, parsedUrl)
    })
    .listen("80", () => {
      console.log(`Ready on ${process.env.APP_ORIGIN}`)
    })
})
