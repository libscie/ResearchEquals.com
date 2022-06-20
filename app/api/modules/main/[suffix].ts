import { BlitzApiHandler } from "blitz"

const handler: BlitzApiHandler = (req, res) => {
  const {
    query: { suffix },
  } = req

  res.end(`Post: ${suffix}`)
}
export default handler
