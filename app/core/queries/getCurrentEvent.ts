import db from "db"

export default async function getCurrentEvent(slug: String) {
  const currentEvent = await db.supportingEvents.findFirst({
    where: {
      slug: slug?.toString().toLowerCase(),
    },
  })

  return currentEvent
}
