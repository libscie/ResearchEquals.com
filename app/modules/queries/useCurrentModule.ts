import db from "db"

export default async function getCurrentWorkspace({ suffix }) {
  const module = await db.module.findFirst({
    where: { suffix },
    include: {
      authors: {
        orderBy: {
          authorshipRank: "asc",
        },
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
      children: {
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
