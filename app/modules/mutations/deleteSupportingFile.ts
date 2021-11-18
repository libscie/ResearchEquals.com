import { NotFoundError, resolver } from "blitz"
import db from "db"
import axios from "axios"
import { Prisma } from "prisma"

export default resolver.pipe(resolver.authorize(), async ({ suffix, uuid }) => {
  const module = await db.module.findFirst({
    where: { suffix },
  })
  let supportingFiles = module!.supporting as Prisma.JsonObject
  supportingFiles.files = supportingFiles.files.filter((file) => file.uuid !== uuid)

  const updatedModule = await db.module.update({
    where: { suffix: suffix },
    data: {
      supporting: supportingFiles,
    },
    include: {
      authors: {
        include: {
          workspace: true,
        },
      },
      license: true,
      type: true,
      parents: true,
    },
  })
  // Force all authors to reapprove for publishing
  await db.authorship.updateMany({
    where: {
      moduleId: module!.id,
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

  return updatedModule!
})
