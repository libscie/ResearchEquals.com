import { api } from "app/blitz-server"
import { NextApiRequest, NextApiResponse } from "next"
import { getSession } from "@blitzjs/auth"
import db from "../../../db"

const webhook = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession(req, res)

  if (session.$publicData.role != "SUPERADMIN") {
    return res.status(403).json({ error: `Forbidden` })
  }

  const type = await db.collectionType.findFirstOrThrow({
    where: {
      type: "COMMUNITY",
    },
  })

  await db.collection.update({
    where: {
      suffix: req.query.suffix as string,
    },
    data: {
      collectionTypeId: type.id,
      upgraded: true,
    },
  })

  res.statusCode = 200
  res.setHeader("Content-Type", "application/json")
  res.end(
    JSON.stringify({
      message: `Collection ${req.query.suffix} successfully upgraded to ${type.type}`,
    }),
  )
}

export default api(webhook)
