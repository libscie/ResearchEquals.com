import db from "db"
import { CronJob } from "quirrel/blitz"
import algoliasearch from "algoliasearch"
import moment from "moment"

const client = algoliasearch(process.env.ALGOLIA_APP_ID!, process.env.ALGOLIA_API_ADMIN_KEY!)
const index = client.initIndex(`${process.env.ALGOLIA_PREFIX}_workspaces`)

export default CronJob(
  "api/update-index", // 👈 the route that it's reachable on
  "0 0 * * *", // “At 00:00 every day.”
  async () => {
    const authors = await db.workspace.findMany()

    const updateAuthors = authors.map((author) => {
      return {
        objectID: author.id,
        updatedAt: moment(author.updatedAt).format(),
      }
    })

    await index.partialUpdateObjects(updateAuthors)
  }
)
