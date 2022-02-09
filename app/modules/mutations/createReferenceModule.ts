import { resolver } from "blitz"
import db, { Prisma } from "db"
import axios from "axios"
import algoliasearch from "algoliasearch"

const client = algoliasearch(process.env.ALGOLIA_APP_ID!, process.env.ALGOLIA_API_ADMIN_KEY!)
const index = client.initIndex(`${process.env.ALGOLIA_PREFIX}_modules`)

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export default resolver.pipe(resolver.authorize(), async ({ doi }, ctx) => {
  // Will auto-throw if resource not found
  const cr = await axios.get(`https://api.crossref.org/works/${doi}`)
  const metadata = cr.data.message

  const crType = capitalizeFirstLetter(metadata.type.replace("-", " "))
  let licenseUrl = undefined
  if (metadata.license) {
    const filter = metadata.license.filter((license) => license["content-version"] === "vor")
    licenseUrl = filter && filter.length > 0 ? filter[0].URL : undefined
  }

  const module = await db.module.create({
    data: {
      published: true,
      publishedAt: new Date(
        metadata.published["date-parts"][0].map((y) => y.toString().padStart(2, "0")).join("-")
      ),
      publishedWhere: metadata["container-title"][0]
        ? metadata["container-title"][0]
        : metadata.publisher,
      prefix: metadata.DOI.split("/")[0],
      suffix: metadata.DOI.split("/").slice(1).join("/"),
      isbn: metadata.ISBN ? metadata.ISBN[0] : undefined,
      url: `https://doi.org/${metadata.DOI}`,
      title: metadata.title[0],
      description: metadata.abstract,
      type: {
        connectOrCreate: {
          where: {
            name: crType,
          },
          create: {
            name: crType,
          },
        },
      },
      license: licenseUrl
        ? {
            connectOrCreate: {
              where: { url: licenseUrl },
              create: {
                url: licenseUrl,
                source: "CrossRef",
              },
            },
          }
        : undefined,
      authorsRaw: { object: metadata.author },
      referencesRaw: metadata["reference-count"] > 0 ? { object: metadata.reference } : undefined,
    },
    include: {
      license: true,
      type: true,
    },
  })

  await index.saveObject({
    objectID: module.id,
    doi: `${module.prefix}/${module.suffix}`,
    suffix: module.suffix,
    license: module.license?.url,
    type: module.type.name,
    // It's called name and not title to improve Algolia search
    name: module.title,
    description: module.description,
    publishedAt: module.publishedAt,
    displayColor: module.displayColor,
  })

  return module
})
