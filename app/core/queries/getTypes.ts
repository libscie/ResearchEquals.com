import db from "db"

export default async function getTypes() {
  const types = await db.moduleType.findMany({
    orderBy: [
      {
        name: "desc",
      },
    ],
  })

  return types
}
