import db from "db"

export default async function getLicenses() {
  const licenses = await db.license.findMany({
    orderBy: [
      {
        name: "desc",
      },
    ],
  })

  console.log(licenses)
  return licenses
}
