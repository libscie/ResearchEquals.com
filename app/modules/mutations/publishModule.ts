import { NotFoundError, resolver } from "blitz"
import db from "db"
import moment from "moment"
import algoliasearch from "algoliasearch"
import axios from "axios"
import convert from "xml-js"
import FormData from "form-data"
import { Readable } from "stream"

const client = algoliasearch(process.env.ALGOLIA_APP_ID!, process.env.ALGOLIA_API_ADMIN_KEY!)
const index = client.initIndex(`${process.env.ALGOLIA_PREFIX}_modules`)

export default resolver.pipe(resolver.authorize(), async ({ id, suffix }, ctx) => {
  const datetime = Date.now()

  const module = await db.module.findFirst({
    where: {
      id,
    },
    include: {
      license: true,
      type: true,
    },
  })

  if (!module!.main) throw Error("Main file is empty")

  // TODO: Generate JS Object to convert to XML
  // const jsData = {}
  // const xmlData = convert.js2xml(jsData)
  // const xmlStream = new Readable()
  // xmlStream._read = () => {}
  // xmlStream.push(xmlData)
  // xmlStream.push(null)

  // const form = new FormData()
  // form.append("operation", "doMDUpload")
  // form.append("login_id", process.env.CROSSREF_LOGIN_ID)
  // form.append("login_passwd", process.env.CROSSREF_LOGIN_PASSWD)
  // form.append("fname", xmlStream, {
  //   filename: `${suffix}.xml`,
  //   contentType: "text/xml",
  //   knownLength: (xmlStream as any)._readableState!.length,
  // })

  // await axios.post(process.env.CROSSREF_URL!, form, { headers: form.getHeaders() })
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
