import { api } from "app/blitz-server"
import { NextApiHandler } from "next"
import db from "db"
import { Feed } from "feed"

// https://github.com/jpmonette/feed
const rssFeedCollection: NextApiHandler = async (req, res) => {
  const {
    query: { suffix },
  } = req

  const collection = await db.collection.findFirst({
    where: { suffix: suffix?.toString() },
    include: {
      type: true,
      submissions: {
        include: {
          module: true,
        },
      },
    },
  })

  if (collection?.type.type === "INDIVIDUAL") {
    throw new Error("Not available for individual collections. Please upgrade for an RSS feed.")
  }

  const feed = new Feed({
    title: collection!.title!,
    description: collection!.description!,
    id: `${process.env.APP_ORIGIN}/collection/${collection?.suffix}`,
    link: `${process.env.APP_ORIGIN}/collection/${collection?.suffix}`,
    language: "en", // optional, used only in RSS 2.0, possible values: http://www.w3.org/TR/REC-html40/struct/dirlang.html#langcodes
    image: collection!.icon!["cdnUrl"],
    // favicon: "http://example.com/favicon.ico",
    copyright: "CC0 Public Domain Dedication",
    updated: collection?.updatedAt, // optional, default = today
    feedLinks: {
      // json: "https://example.com/json",
      // atom: "https://example.com/atom",
      rss: `${process.env.APP_ORIGIN}/api/rss/collections/${collection?.suffix}`,
    },
  })

  collection?.submissions.map((submission) => {
    feed.addItem({
      title: submission.module.title,
      id: `https://doi.org/${submission.module.prefix}/${submission.module.suffix}`,
      link: `https://doi.org/${submission.module.prefix}/${submission.module.suffix}`,
      description: submission.module.description as string,

      date: submission.updatedAt,
    })
  })

  return new Promise<void>((resolve, reject) => {
    res.statusCode = 200
    res.setHeader("Content-Type", "application/rss+xml")
    res.end(feed.rss2().toString())
    resolve()
  })
}

export default api(rssFeedCollection)
