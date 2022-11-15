import { api } from "app/blitz-server"
import { NextApiHandler } from "next"
import { PrismaClient, Prisma } from "@prisma/client"
import db from "db"
import https from "https"

const handler: NextApiHandler = async (req, res) => {
  const {
    query: { suffix, filename },
  } = req

  const currentModule = await db.module.findFirst({
    where: { suffix: suffix?.toString(), published: true },
  })

  const files = currentModule?.supporting as Prisma.JsonArray

  return new Promise((resolve, reject) => {
    files["files"].filter((file) => {
      if (file.original_filename === filename) {
        https
          .get(file.original_file_url, (response) => {
            var data = [] as any

            response
              .on("data", function (chunk) {
                data.push(chunk)
              })
              .on("end", function () {
                res.statusCode = 200
                res.setHeader("Content-Type", file.mime_type)
                res.setHeader(
                  "Content-Disposition",
                  `filename=${encodeURI(file.original_filename)}`
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
      }
    })
  })
}

export default api(handler)
