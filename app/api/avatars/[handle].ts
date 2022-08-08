import { BlitzApiHandler } from "blitz"
import db from "db"
import https from "https"

const handler: BlitzApiHandler = async (req, res) => {
  const {
    query: { handle },
  } = req

  const author = await db.workspace.findFirst({
    where: { handle: handle?.toString() },
  })

  const mimetype = !author?.avatar!.match(/ucarecdn/g) ? "image/svg+xml" : "image"
  return new Promise((resolve, reject) => {
    https
      .get(author?.avatar!, (response) => {
        var data = [] as any

        let buffer
        response
          .on("data", function (chunk) {
            data.push(chunk)
          })
          .on("end", function () {
            res.statusCode = 200
            res.setHeader("Content-Type", mimetype)
            res.setHeader("Content-Disposition", `filename=avatar-${author?.handle}`)
            var buffer = Buffer.concat(data)
            res.end(buffer)
            resolve()
          })
      })
      .on("error", (e) => {
        res.status(404).end()
        resolve()
      })
  })
}

export default handler
