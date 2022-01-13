import db from "db"

const itemCounter = (array, item) =>
  array.flat(Infinity).filter((currentItem) => currentItem == item).length

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index
}

export default async function getSignature() {
  const workspaces = await db.workspace.findMany({
    orderBy: [
      {
        createdAt: "asc",
      },
    ],
  })

  const dates = workspaces.map((workspace) => {
    return workspace.createdAt?.toISOString().substr(0, 10)
  })

  let data = [] as any
  const uniqDates = dates.filter(onlyUnique)
  uniqDates.forEach((date, index) => {
    const epochTime = new Date(date!)
    data.push({
      time: epochTime.getTime(),
      workspaces:
        index !== 0
          ? itemCounter(dates, date) + data[index - 1].workspaces
          : itemCounter(dates, date),
    })
  })
  console.log(data)

  return data
}
