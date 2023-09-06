import { api } from "app/blitz-server"
import { NextApiRequest, NextApiResponse } from "next"
import { getSession } from "@blitzjs/auth"
import db from "../../db"

const webhook = async (req: NextApiRequest, res: NextApiResponse) => {
  const date = req.query.from as string

  let modules
  if (date) {
    modules = await db.module.findMany({
      where: {
        publishedAt: {
          gte: new Date(date),
        },
        publishedWhere: "ResearchEquals",
        published: true,
      },
      include: {
        references: {
          include: {
            authors: {
              include: {
                workspace: true,
              },
            },
          },
          orderBy: {
            title: "asc",
          },
        },
        authors: {
          orderBy: {
            authorshipRank: "asc",
          },
          include: {
            workspace: true,
          },
        },
        license: true,
        type: true,
        parents: {
          include: {
            type: true,
            authors: {
              include: {
                workspace: true,
              },
              orderBy: {
                authorshipRank: "asc",
              },
            },
          },
        },
        children: {
          include: {
            type: true,
            authors: {
              include: {
                workspace: true,
              },
              orderBy: {
                authorshipRank: "asc",
              },
            },
          },
        },
      },
    })
  } else {
    modules = await db.module.findMany({
      where: {
        publishedWhere: "ResearchEquals",
        published: true,
      },
      include: {
        references: {
          include: {
            authors: {
              include: {
                workspace: true,
              },
            },
          },
          orderBy: {
            title: "asc",
          },
        },
        authors: {
          orderBy: {
            authorshipRank: "asc",
          },
          include: {
            workspace: true,
          },
        },
        license: true,
        type: true,
        parents: {
          include: {
            type: true,
            authors: {
              include: {
                workspace: true,
              },
              orderBy: {
                authorshipRank: "asc",
              },
            },
          },
        },
        children: {
          include: {
            type: true,
            authors: {
              include: {
                workspace: true,
              },
              orderBy: {
                authorshipRank: "asc",
              },
            },
          },
        },
      },
    })
  }

  res.statusCode = 200
  res.setHeader("Content-Type", "application/json")
  res.end(
    JSON.stringify({
      modules,
    }),
  )
}

export default api(webhook)
