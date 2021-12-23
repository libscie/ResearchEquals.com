import db from "db"

export default async function getLicenses() {
  const licenses = await db.license.findMany({
    orderBy: [
      {
        price: "asc",
      },
      {
        name: "desc",
      },
    ],
  })

  return licenses
}
