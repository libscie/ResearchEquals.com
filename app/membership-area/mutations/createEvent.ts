import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"
import { SupportingEvent } from "@prisma/client"

import generateSuffix from "../../modules/mutations/generateSuffix"
import { generateCollectionXml } from "../../core/crossref/generateCrossRefXml"
import { isURI } from "app/core/crossref/ai_program"
import submitToCrossRef from "app/core/utils/submitToCrossRef"
import { Ctx } from "blitz"

interface Event {
  title: string
  slug: string
  content: string
  type: SupportingEvent
}

export default resolver.pipe(resolver.authorize(), async (event: Event, ctx: Ctx) => {
  ctx.session.$authorize("SUPERADMIN")
  console.log(event)

  await db.supportingEvents.create({
    data: {
      title: event.title,
      type: event.type,
      slug: event.slug,
      content: event.content,
    },
  })

  return null
})
