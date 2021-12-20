import { NotFoundError, resolver } from "blitz"
import db from "db"
import { Prisma } from "prisma"

export default resolver.pipe(resolver.authorize(), async ({ id, newFiles }) => {
  // 1. Get module supporting files JSON
  const oldModule = await db.module.findFirst({
    where: { id },
  })
  let supportingFiles = oldModule?.supporting as Prisma.JsonObject
  // 2. Map the array to push each files object into supporting files
  newFiles.map((newFile) => {
    supportingFiles.files.push(newFile)
  })
  // 3. write the data into the module
  const updatedModule = await db.module.update({
    where: { id },
    data: { supporting: supportingFiles as Prisma.JsonObject },
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

  return updatedModule!
})
