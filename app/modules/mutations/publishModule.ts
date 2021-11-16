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
  const module = await db.module.update({
    where: {
      id,
    },
    data: {
      published: true,
      publishedAt: moment(datetime).format(),
    },
    include: {
      license: true,
      type: true,
    },
  })

  await index.saveObject({
    objectID: module.id,
    suffix: module.suffix,
    doi: `10.53962/${module.suffix}`,
    license: module.license?.url,
    type: module.type.name,
    name: module.title,
    description: module.description,
    publishedAt: module.publishedAt,
  })

  return true
})
