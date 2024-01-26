import db from "db"
import { CronJob } from "quirrel/blitz"
import { sendDigest } from "app/postmark"

// https://stackoverflow.com/questions/6117814/get-week-of-year-in-javascript-like-in-php
function getWeekNumber(d) {
  // Copy date so don't modify original
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
  // Set to nearest Thursday: current date + 4 - current day number
  // Make Sunday's day number 7
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7))
  // Get first day of year
  var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  // Calculate full weeks to nearest Thursday
  var weekNo = Math.ceil(((d - yearStart.getTime()) / 86400000 + 1) / 7)
  // Return array of year and week number
  return weekNo
}

export default CronJob(
  "api/weekly-digest-mailer", // 👈 the route that it's reachable on
  "0 7 * * 1", // every monday at 7AM
  async () => {
    const datetime = new Date()
    const lastWeek = new Date(datetime.getTime() - 24 * 60 * 60 * 1000 * 7)

    // find workspaces
    const workspaces = await db.workspace.findMany({
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                emailConsent: true,
                email: true,
                emailIsVerified: true,
              },
            },
          },
        },
      },
    })

    const latestWorkspaces = await db.workspace.findMany({
      where: {
        createdAt: {
          gt: lastWeek,
        },
        NOT: {
          firstName: null,
          lastName: null,
        },
      },
    })

    workspaces.map(async (workspace) => {
      const workspaceInfo = await db.workspace.findFirst({
        where: {
          id: workspace.id,
        },
        include: {
          following: {
            include: {
              authorships: {
                include: {
                  module: true,
                },
              },
            },
          },
          followingCollections: {
            include: {
              submissions: {
                include: {
                  module: true,
                  editor: {
                    include: {
                      workspace: true,
                    },
                  },
                },
              },
            },
          },
        },
      })

      let newModules = [] as any
      workspaceInfo?.following.map((following) => {
        return following.authorships.map((author) => {
          if (
            author.module.published &&
            author.module.publishedAt?.getTime()! > lastWeek.getTime()
          ) {
            newModules.push({
              title: author.module.title,
              url: `https://doi.org/${author.module.prefix}/${author.module.suffix}`,
            })
          }
        })
      })

      const myDrafts = await db.authorship.findMany({
        where: {
          acceptedInvitation: true,
          module: { published: false },
          workspaceId: workspace.id,
        },
        include: {
          module: {
            select: { title: true, suffix: true },
          },
        },
      })

      // invitations
      const invitations = await db.authorship.findMany({
        where: {
          acceptedInvitation: null,
          workspaceId: workspace.id,
        },
        include: {
          module: {
            select: {
              title: true,
              suffix: true,
            },
          },
        },
      })

      let collections = workspaceInfo?.followingCollections.map((collection) => {
        let submissions = collection.submissions.map((submission) => {
          if (submission.updatedAt.getTime()! > lastWeek.getTime()) {
            return {
              name: submission.module.title,
              url: `https://doi.org/${submission.module.prefix}/${submission.module.suffix}`,
              quote:
                submission.comment &&
                `(${submission.editor?.workspace.firstName} says: ${submission.comment})`,
            }
          }
        })
        if (submissions[0] === undefined) {
          submissions = []
        }
        const js = {
          name: collection.title,
          url: `https://doi.org/${process.env.DOI_PREFIX}/collections/${collection.suffix}`,
          submissions,
        }
        if (js.submissions.length > 0) {
          return js
        }
      })
      collections = collections?.filter((x) => x)
      workspace.members.map(async (member) => {
        if (
          member.emailInvitations &&
          member.user?.emailConsent &&
          member.user.emailIsVerified &&
          (newModules.length > 0 ||
            myDrafts.length > 0 ||
            invitations.length > 0 ||
            collections!.length > 0)
        ) {
          await sendDigest(
            {
              title: "ResearchEquals weekly",
              name: workspace.name || workspace.firstName || `@${workspace.handle}`,
              week: getWeekNumber(datetime),
              year: datetime.getFullYear(),
              modules: newModules.map((module) => {
                return {
                  name: module.title,
                  url: module.url,
                }
              }),
              drafts: myDrafts.map((draft) => {
                return {
                  name: draft.module.title,
                  url: `${process.env.APP_ORIGIN}/drafts?suffix=${draft.module.suffix}`,
                }
              }),
              invitations: invitations.map((invite) => {
                return {
                  name: invite.module.title,
                  url: `${process.env.APP_ORIGIN}/invitations?suffix=${invite.module.suffix}`,
                }
              }),
              newWorkspaces: latestWorkspaces.map((workspace) => {
                return {
                  name: workspace.name || `${workspace.firstName} ${workspace.lastName}`,
                  url: `${process.env.APP_ORIGIN}/${workspace.handle}`,
                }
              }),
              collections: collections,
              product_url: process.env.APP_ORIGIN,
              product_name: "ResearchEquals",
              company_name: "Liberate Science GmbH",
            },
            member.user!.email,
          )
        }
      })
    })
  },
)
