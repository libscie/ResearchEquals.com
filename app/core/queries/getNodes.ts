import db from "db"

export default async function getNodes() {
  const modules = await db.module.findMany({
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
      parents: {
        include: {
          type: true,
        },
      },
    },
  })

  const nodesData = modules.map((module) => {
    return {
      id: `${module.prefix}/${module.suffix}`,
      data: {
        label: `${module.title.substr(0, 30)} ${module.title.length > 30 ? "[...]" : ""}`,
        module,
      },
      type: module.parents.length > 0 ? "default" : "input",
      position: { x: 250, y: 250 },
      style: { backgroundColor: module.displayColor, color: "#fff" },
    }
  })

  let edgesData = [] as any
  modules.map((module) => {
    if (module.parents.length > 0) {
      module.parents.map((parent) => {
        edgesData.push({
          id: `e${parent.prefix}/${parent.suffix}-${module.prefix}/${module.suffix}}`,
          source: `${parent.prefix}/${parent.suffix}`,
          target: `${module.prefix}/${module.suffix}`,
          animated: true,
          // style: { stroke: "#000" },
        })
      })
    }
  })

  return { nodesData, edgesData }
}
