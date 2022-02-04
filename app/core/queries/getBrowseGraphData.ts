import db from "db"

const itemCounter = (array, item) =>
  array.flat(Infinity).filter((currentItem) => currentItem == item).length

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index
}

export default async function getSignature() {
  const modules = await db.module.findMany({
    where: {
      published: true,
      prefix: process.env.DOI_PREFIX,
    },
    orderBy: [
      {
        publishedAt: "asc",
      },
    ],
    select: {
      publishedAt: true,
    },
  })

  const dates = modules.map((module) => {
    return module.publishedAt?.toISOString().substr(0, 10)
  })

  let data = [] as any
  const uniqDates = dates.filter(onlyUnique)
  uniqDates.forEach((date, index) => {
    const epochTime = new Date(date!)
    data.push({
      time: epochTime.getTime(),
      modules:
        index !== 0 ? itemCounter(dates, date) + data[index - 1].modules : itemCounter(dates, date),
    })
  })

  return data
}
