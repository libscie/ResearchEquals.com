import db from "db"

// TODO: Sort by authorshipRank?
export default async function getCurrentWorkspace({ suffix }) {
  const module = await db.module.findFirst({
    where: { suffix },
    include: {
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
          },
        },
      },
    },
  })

  return module
}
