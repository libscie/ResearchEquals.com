import { resolver } from "@blitzjs/rpc"
import db from "db"
import axios from "axios"

export default resolver.pipe(resolver.authorize(), async ({ id, uuid }) => {
  const currentModule = await db.module.update({
    where: { id },
    data: { main: {} },
  })

  // Force all authors to reapprove for publishing
  await db.authorship.updateMany({
    where: {
      moduleId: currentModule.id,
    },
    data: {
      readyToPublish: false,
    },
  })

  // Remove uuid from Uploadcare
  const datestring = new Date()
  await axios.delete(`https://api.uploadcare.com/files/${uuid}/`, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/vnd.uploadcare-v0.5+json",
      Date: datestring.toUTCString(),
      Authorization: `Uploadcare.Simple ${process.env.UPLOADCARE_PUBLIC_KEY}:${process.env.UPLOADCARE_SECRET_KEY}`,
    },
  })

  const updatedModule = await db.module.findFirst({
    where: { id },
    include: {
      references: {
        include: {
          authors: {
            include: {
              workspace: true,
            },
          },
        },
        orderBy: {
          title: "asc",
        },
      },
      authors: {
        include: {
          workspace: true,
        },
      },
      license: true,
      type: true,
      parents: {
        include: {
          type: true,
          authors: {
            include: {
              workspace: true,
            },
            orderBy: {
              authorshipRank: "asc",
            },
          },
        },
      },
      children: {
        include: {
          type: true,
          authors: {
            include: {
              workspace: true,
            },
            orderBy: {
              authorshipRank: "asc",
            },
          },
        },
      },
    },
  })

  return updatedModule!
})
