import { sendCollectionSubmission } from "app/postmark"
import { Queue } from "quirrel/next"
import db from "../../db"

export default Queue("api/collection-submission-mailer", async (submissionId: number) => {
  // get submission
  const submission = await db.submission.findFirst({
    where: {
      id: submissionId,
    },
    include: {
      module: true,
      submittedBy: true,
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
  submission?.collection.editors.map(async (editor) => {
    editor.workspace.members.map(async (member) => {
      if (member.emailCollections && member.user?.emailConsent && member.user.emailIsVerified) {
        await sendCollectionSubmission(
          {
            name:
              submission.submittedBy?.firstName && submission.submittedBy?.lastName
                ? `${submission.submittedBy?.firstName} ${submission.submittedBy?.lastName}`
                : submission.submittedBy?.handle,
            collection: submission.collection.title,
            title: submission.module.title,
            workspaceUrl: `${process.env.APP_ORIGIN}/${submission.submittedBy?.handle}`,
            submissionUrl: `https://doi.org/${submission.module.prefix}/${submission.module.suffix}`,
            adminUrl: `${process.env.APP_ORIGIN}/collections/${submission.collection.suffix}/admin`,
          },
          member.user?.email
        )
      }
    })
  })
  // submission.
  // module?.authors.map(async (author) => {
  //   author.workspace?.members.map(async (member) => {
  //     if (
  //       member.emailApprovals &&
  //       member.user?.emailConsent &&
  //       member.user.emailIsVerified &&
  //       author.acceptedInvitation
  //     ) {
  //       await sendApproval(
  //         {
  //           name: `${author.workspace?.firstName} ${author.workspace?.lastName}`,
  //           title: module.title,
  //           url: `${process.env.APP_ORIGIN}/drafts?suffix=${module.suffix}`,
  //         },
  //         member.user?.email
  //       )
  //     }
  //   })
  // })
})
