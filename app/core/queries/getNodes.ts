import db from "db"

export default async function getNodes() {
  const nodes = await db.module.findMany({
    where: {
      published: true,
    },
    orderBy: [
      {
        updatedAt: "desc",
      },
    ],
    include: {
      type: true,
      // authors: {
      //   include: {
      //     workspace: true,
      //   },
      //   orderBy: {
      //     authorshipRank: "asc",
      //   },
      // },
    },
  })

  const nodesData = nodes.map((node) => {
    return {
      id: `${node.prefix}/${node.suffix}`,
      data: { label: `${node.prefix}/${node.suffix}`, node },
      position: { x: 250, y: 250 },
    }
  })

  console.log(nodesData)

  return nodesData
}
