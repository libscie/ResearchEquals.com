import { api } from "app/blitz-server"
import { NextApiHandler } from "next"
import db from "db"
import https from "https"

const handler: NextApiHandler = async (req, res) => {
  const {
    query: { suffix },
  } = req

  const currentModule = await db.module.findFirst({
    where: { suffix: suffix?.toString(), published: true },
  })
  return new Promise((resolve, reject) => {
    https
      .get(currentModule?.main!["cdnUrl"], (response) => {
        var data = [] as any

        response
          .on("data", function (chunk) {
            data.push(chunk)
          })
          .on("end", function () {
            res.statusCode = 200
            res.setHeader("Content-Type", currentModule?.main!["mimeType"])
            res.setHeader(
              "Content-Disposition",
              `filename=${encodeURI(currentModule?.main!["name"])}`
            )
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

export default api(handler)
