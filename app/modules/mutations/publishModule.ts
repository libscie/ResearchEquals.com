import { NotFoundError, resolver } from "blitz"
import db from "db"
import moment from "moment"
import algoliasearch from "algoliasearch"
import axios from "axios"
import convert from "xml-js"
import FormData from "form-data"
import { Readable } from "stream"
import generateCrossRefObject from "./generateCrossRefObject"

const client = algoliasearch(process.env.ALGOLIA_APP_ID!, process.env.ALGOLIA_API_ADMIN_KEY!)
const index = client.initIndex(`${process.env.ALGOLIA_PREFIX}_modules`)

export default resolver.pipe(resolver.authorize(), async ({ id, suffix }) => {
  const datetime = Date.now()

  // TODO: Can be simplified along with stripe_webhook.ts
  const module = await db.module.findFirst({
    where: {
      id,
    },
    include: {
      license: true,
      type: true,
      authors: {
        include: {
          workspace: true,
        },
      },
    },
  })

  if (!module!.main) throw Error("Main file is empty")

  const x = generateCrossRefObject({
    schema: "5.3.1",
    type: module!.type!.name,
    title: module!.title,
    authors: module!.authors!.map((author) => {
      const js = {
        name: author.workspace?.name,
        orcid: author.workspace?.orcid,
      }

      return js
    }),
    citations: [
      // {
      //   publishedWhere: "ResearchEquals",
      //   authors: [
      //     {
      //       name: "Chris Hartgerink",
      //       orcid: "https://orcid.org/0000-0003-1050-6809",
      //     },
      //   ],
      //   publishedAt: "2021",
      //   prefix: "10.53962",
      //   suffix: "1234",
      //   isbn: "978-3-16-148410-0",
      //   title: "This is a test",
      // },
    ],
    abstractText: module!.description,
    license: module!.license!.name,
    license_url: module!.license!.url,
    doi: `${module!.prefix}/${module!.suffix}`,
    resolve_url: `${process.env.APP_ORIGIN}/modules/${module!.suffix}`,
  })

  const xmlData = convert.js2xml(x)
  const xmlStream = new Readable()
  xmlStream._read = () => {}
  xmlStream.push(xmlData)
  xmlStream.push(null)

  const form = new FormData()
  form.append("operation", "doMDUpload")
  form.append("login_id", process.env.CROSSREF_LOGIN_ID)
  form.append("login_passwd", process.env.CROSSREF_LOGIN_PASSWD)
  form.append("fname", xmlStream, {
    filename: `${module!.suffix}.xml`,
    contentType: "text/xml",
    knownLength: (xmlStream as any)._readableState!.length,
  })

  await axios.post(process.env.CROSSREF_URL!, form, { headers: form.getHeaders() })

  const publishedModule = await db.module.update({
    where: {
      id,
    },
    data: {
      published: true,
      publishedAt: moment(datetime).format(),
      publishedWhere: "ResearchEquals",
      url: `https://doi.org/${process.env.DOI_PREFIX}/${module!.suffix}`,
    },
    include: {
      license: true,
      type: true,
    },
  })

  await index.saveObject({
    objectID: publishedModule.id,
    doi: `${process.env.DOI_PREFIX}/${publishedModule.suffix}`,
    suffix: publishedModule.suffix,
    license: publishedModule.license?.url,
    type: publishedModule.type.name,
    // It's called name and not title to improve Algolia search
    name: publishedModule.title,
    description: publishedModule.description,
    publishedAt: publishedModule.publishedAt,
  })

  return true
})
