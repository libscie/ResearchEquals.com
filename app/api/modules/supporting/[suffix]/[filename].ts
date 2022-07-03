import { BlitzApiHandler } from "blitz"
import { PrismaClient, Prisma } from "@prisma/client"
import db from "db"
import https from "https"

const handler: BlitzApiHandler = async (req, res) => {
  const {
    query: { suffix, filename },
  } = req

  const module = await db.module.findFirst({
    where: { suffix: suffix?.toString(), published: true },
  })

  const files = module?.supporting as Prisma.JsonArray

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
                res.setHeader("Content-Disposition", `filename=${file.original_filename}`)
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

export default handler
