import db from "db"

export default async function getCurrentWorkspace({ suffix }) {
  const module = await db.module.findFirst({
    where: { suffix },
  })

  return module
}
