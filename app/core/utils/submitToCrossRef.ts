import axios from "axios"
import FormData from "form-data"
import { Readable } from "stream"

const submitToCrossRef = async ({ xmlData, suffix }) => {
  const xmlStream = new Readable()
  xmlStream._read = () => {}
  xmlStream.push(xmlData)
  xmlStream.push(null)

  const form = new FormData()
  form.append("operation", "doMDUpload")
  form.append("login_id", process.env.CROSSREF_LOGIN_ID)
  form.append("login_passwd", process.env.CROSSREF_LOGIN_PASSWD)
  form.append("fname", xmlStream, {
    filename: `${suffix}.xml`,
    contentType: "text/xml",
    knownLength: (xmlStream as any)._readableState!.length,
  })

  await axios.post(process.env.CROSSREF_URL!, form, { headers: form.getHeaders() })
}

export default submitToCrossRef
