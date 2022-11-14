import { resolver } from "@blitzjs/rpc"
import db from "db"
import { isURI } from "../../core/crossref/ai_program"
import submitToCrossRef from "app/core/utils/submitToCrossRef"
import moduleXml from "../../core/utils/moduleXml"

export default resolver.pipe(resolver.authorize(), async ({ id }: { id: number }) => {
  const datetime = Date.now()

  // TODO: Can be simplified along with stripe_webhook.ts and publishModule.ts
  const module = await db.module.findFirst({
    where: {
      id,
    },
    include: {
      license: true,
      type: true,
      authors: {
        include: {
          workspace: true,
        },
      },
      references: {
        include: {
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

  if (!module!.main) throw Error("Main file is empty")

  const licenseUrl = module?.license?.url ?? ""
  if (!isURI(licenseUrl)) throw Error("License URL is not a valid URI")

  const resolveUrl = `${process.env.APP_ORIGIN}/modules/${module!.suffix}`

  if (!isURI(resolveUrl)) throw Error("Resolve URL is not a valid URI")

  await submitToCrossRef({
    xmlData: moduleXml({
      module,
      licenseUrl,
      resolveUrl,
    }),
    suffix: module!.suffix,
  })
  return true
})
