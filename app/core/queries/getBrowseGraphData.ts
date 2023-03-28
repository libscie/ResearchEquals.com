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
      main: true,
      supporting: true,
      publishedAt: true,
    },
  })

  // Get file extensions
  const re = /(?:\.([^.]+))?$/
  let mainFilenames = [] as any
  let supportingFilenames = [] as any
  modules.map((module) => {
    mainFilenames.push(re.exec(module.main!["name"])![1])
    if (module.supporting!["files"].length > 0) {
      module.supporting!["files"].map((file) => {
        supportingFilenames.push(re.exec(file.original_filename)![1])
      })
    }
  })

  const uniqMainExtensions = mainFilenames.filter(onlyUnique)
  let mainExtensions = [] as any
  uniqMainExtensions.forEach((date, index) => {
    mainExtensions.push({
      extension: date ? date : "None",
      count: itemCounter(mainFilenames, date),
    })
  })

  const uniqSupportingExtensions = supportingFilenames.filter(onlyUnique)
  let supportingExtensions = [] as any
  uniqSupportingExtensions.forEach((date, index) => {
    supportingExtensions.push({
      extension: date,
      count: itemCounter(supportingFilenames, date),
    })
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

  const collections = await db.collection.findMany({
    where: {
      public: true,
    },
    orderBy: [
      {
        createdAt: "asc",
      },
    ],
  })

  let dataCollections = [] as any

  const datesCollections = collections.map((collection) => {
    return collection.createdAt?.toISOString().substr(0, 10)
  })
  const uniqDatesCollections = datesCollections.filter(onlyUnique)
  uniqDatesCollections.forEach((date, index) => {
    const epochTime = new Date(date!)
    dataCollections.push({
      time: epochTime.getTime(),
      collections:
        index !== 0
          ? itemCounter(dates, date) + dataCollections[index - 1].collections
          : itemCounter(dates, date),
    })
  })

  return { data, mainExtensions, supportingExtensions, dataCollections }
}
