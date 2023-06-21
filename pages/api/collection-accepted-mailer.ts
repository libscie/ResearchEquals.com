import { acceptSubmission } from "app/postmark"
import { Queue } from "quirrel/next"
import db from "../../db"

export default Queue("api/collection-accepted-mailer", async (submissionId: number) => {
  const submission = await db.submission.findFirst({
    where: {
      id: submissionId,
    },
    include: {
      module: true,
      submittedBy: {
        include: {
          members: {
            include: {
              user: {
                select: {
                  emailConsent: true,
                  email: true,
                  emailIsVerified: true,
                },
              },
            },
          },
        },
      },
      editor: {
        include: {
          workspace: true,
        },
      },
      collection: {
        include: {
          editors: {
            include: {
              workspace: {
                include: {
                  members: {
                    include: {
                      user: {
                        select: {
                          emailConsent: true,
                          email: true,
                          emailIsVerified: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  })

  // send an email to all editors
  submission?.submittedBy?.members.map(async (member) => {
    if (member.emailCollections && member.user?.emailConsent && member.user.emailIsVerified) {
      await acceptSubmission(
        {
          editor:
            submission.editor?.workspace.firstName && submission.editor?.workspace.lastName
              ? `${submission.editor?.workspace.firstName} ${submission.editor?.workspace.lastName}`
              : submission.editor?.workspace.handle,
          collection: submission.collection.title,
          collectionUrl: `${process.env.APP_ORIGIN}/collections/${submission.collection.suffix}`,
          title: submission.module.title,
          submissionUrl: `https://doi.org/${submission.module.prefix}/${submission.module.suffix}`,
          product_name: "ResearchEquals",
          company_name: "Liberate Science GmbH",
        },
        member.user?.email
      )
    }
  })
})
