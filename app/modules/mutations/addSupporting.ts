import { resolver } from "@blitzjs/rpc"
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
    let x = supportingFiles.files.filter((file) => {
      if (file.original_filename == newFile.original_filename) {
        // throw new Error("Please check for duplicates.")
        return file
      }
    })
    if (x.length === 0) {
      supportingFiles.files.push(newFile)
    }
  })

  // Force all authors to reapprove for publishing
  await db.authorship.updateMany({
    where: {
      moduleId: id,
    },
    data: {
      readyToPublish: false,
    },
  })
  // 3. write the data into the module
  const updatedModule = await db.module.update({
    where: { id },
    data: { supporting: supportingFiles as Prisma.JsonObject },
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
