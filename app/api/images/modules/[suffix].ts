import { BlitzApiRequest, BlitzApiResponse } from "blitz"
import db from "db"
import htmlToImage from "../../../htmlToImage"

const handler = async (req: BlitzApiRequest, res: BlitzApiResponse) => {
  const suffix = req.query.suffix?.toString()

  const module = await db.module.findFirst({ where: { suffix } })
  const imageBuffer = await htmlToImage(
    `
      <html>
        <head>
          <style>
            * {
              margin: 0;
              padding: 0;
            }

            *,
            *:before,
            *:after {
              box-sizing: border-box;
            }

            html,
            body {
              background: #0099ff;
              width: 1200px;
              height: 628px;
              font-family: "Helvetica Neue", "Helvetica", "Arial", sans-serif;
            }

            div {
              width: 1200px;
              height: 628px;
              padding: 0 200px;
              display: flex;
              align-items: center;
              justify-content: center;
            }

            h1 {
              font-size: 48px;
              line-height: 56px;
              color: #fff;
              margin: 0;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div>
            <h1>${suffix}</h1>
            <p>${module!.title}</p>
          </div>
        </body>
      </html>
    `
  )

  res.statusCode = 200

  res.setHeader("Content-Type", "image/png")
  res.end(imageBuffer)
}
export default handler
