import db from "db"

export default async function getEvents() {
  const events = await db.supportingEvents.findMany({
    select: {
      title: true,
      slug: true,
      type: true,
      content: false,
      createdAt: true,
    },
    orderBy: [
      {
        createdAt: "desc",
      },
    ],
  })

  return events as any
}
