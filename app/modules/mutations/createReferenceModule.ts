import { resolver } from "@blitzjs/rpc"
import db from "db"
import axios from "axios"
import algoliasearch from "algoliasearch"
import he from "he"

const client = algoliasearch(process.env.ALGOLIA_APP_ID!, process.env.ALGOLIA_API_ADMIN_KEY!)
const index = client.initIndex(`${process.env.ALGOLIA_PREFIX}_modules`)

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

interface Input {
  doi: string
}

export default resolver.pipe(resolver.authorize(), async ({ doi }: Input, ctx) => {
  try {
    // Will auto-throw if resource not found
    let cr
    if (process.env.CROSSREF_METADATA_PLUS) {
      cr = await axios.get(`https://api.crossref.org/works/${doi}?mailto=info@libscie.org`, {
        headers: {
          "Crossref-Plus-API-Token": `Bearer ${process.env.CROSSREF_METADATA_PLUS}`,
        },
      })
    } else {
      cr = await axios.get(`https://api.crossref.org/works/${doi}?mailto=info@libscie.org`)
    }

    const metadata = cr.data.message

    const crType = capitalizeFirstLetter(metadata.type.replace("-", " "))
    let licenseUrl = undefined
    if (metadata.license) {
      const filter = metadata.license.filter((license) => license["content-version"] === "vor")
      licenseUrl = filter && filter.length > 0 ? filter[0].URL : undefined
    }

    const currentModule = await db.module.create({
      data: {
        published: true,
        publishedAt: new Date(
          metadata.published["date-parts"][0].map((y) => y.toString().padStart(2, "0")).join("-")
        ),
        publishedWhere: metadata["container-title"][0]
          ? metadata["container-title"][0]
          : metadata.publisher,
        originMetadata: "CrossRef",
        prefix: metadata.DOI.split("/")[0],
        suffix: metadata.DOI.split("/").slice(1).join("/"),
        isbn: metadata.ISBN ? metadata.ISBN[0] : undefined,
        url: `https://doi.org/${metadata.DOI}`,
        title: he.decode(metadata.title[0]),
        description: metadata.abstract,
        type: {
          connectOrCreate: {
            where: {
              name: crType,
            },
            create: {
              name: crType,
              originType: "CrossRef",
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
      objectID: currentModule.id,
      doi: `${currentModule.prefix}/${currentModule.suffix}`,
      suffix: currentModule.suffix,
      license: currentModule.license?.url,
      type: currentModule.type.name,
      // It's called name and not title to improve Algolia search
      name: currentModule.title,
      description: currentModule.description,
      publishedAt: currentModule.publishedAt,
      displayColor: currentModule.displayColor,
    })

    return currentModule
  } catch (error) {
    if (error?.response?.status === 404) {
      try {
        const cr = await axios.get(`https://api.datacite.org/dois/${doi}`)
        const metadata = cr.data
        const currentModule = await db.module.create({
          data: {
            published: true,
            publishedAt: new Date(
              metadata.data.attributes.publicationYear.toString() ||
                metadata.data.attributes.published
            ),
            publishedWhere: metadata.data.attributes.publisher,
            originMetadata: "DataCite",
            prefix: metadata.data.attributes.prefix,
            suffix: metadata.data.attributes.suffix,
            isbn: undefined, // Not used in schema
            url: `https://doi.org/${metadata.data.id}`,
            language: metadata.data.attributes.language || "en",
            title: he.decode(metadata.data.attributes.titles[0].title),
            description: metadata.data.attributes.descriptions[0]
              ? metadata.data.attributes.descriptions[0].description
              : undefined,
            type: {
              connectOrCreate: {
                where: {
                  name: metadata.data.attributes.types.resourceType || "Other",
                },
                create: {
                  name: metadata.data.attributes.types.resourceType || "Other",
                  originType: "DataCite",
                },
              },
            },
            license: metadata.data.attributes.rightsList[0]
              ? {
                  connectOrCreate: {
                    where: { url: metadata.data.attributes.rightsList[0].rightsUri || "undefined" },
                    create: {
                      url: metadata.data.attributes.rightsList[0].rightsUri || "undefined",
                      source: "DataCite",
                    },
                  },
                }
              : undefined,
            authorsRaw: { object: metadata.data.attributes.creators },
            referencesRaw:
              metadata.data.attributes.relatedIdentifiers.map(
                (x) => x.relationType === "Reference" && x
              ).length > 0
                ? metadata.data.attributes.relatedIdentifiers.map(
                    (x) => x.relationType === "Reference" && x
                  )
                : undefined,
          },
          include: {
            license: true,
            type: true,
          },
        })
        await index.saveObject({
          objectID: currentModule.id,
          doi: `${currentModule.prefix}/${currentModule.suffix}`,
          suffix: currentModule.suffix,
          license: currentModule.license?.url,
          type: currentModule.type.name,
          // It's called name and not title to improve Algolia search
          name: currentModule.title,
          description: currentModule.description,
          publishedAt: currentModule.publishedAt,
          displayColor: currentModule.displayColor,
        })
        return currentModule
      } catch (error) {
        if (error?.response?.status === 404)
          throw new Error("Cannot find the reference in CrossRef or DataCite")
        // Print out the error message when the error is not related to 404
        throw new Error(error.message)
      }
    }
    throw new Error(error.message)
  }
})
