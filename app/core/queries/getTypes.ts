import db from "db"

export default async function getTypes() {
  const types = await db.moduleType.findMany({
    where: {
      originType: "ResearchEquals",
    },
    orderBy: [
      {
        name: "asc",
      },
    ],
  })

  return types
}
