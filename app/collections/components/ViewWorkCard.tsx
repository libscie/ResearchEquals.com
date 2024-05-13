import Link from "next/link"
import { useMutation } from "@blitzjs/rpc"
import { Routes } from "@blitzjs/next"
import moment from "moment"
import { LogoTwitter } from "@carbon/icons-react"
import addComment from "../mutations/addComment"
import DoiSubmission from "./DoiSubmission"

const ViewWorkCard = ({ submission, index }) => {
  return (
    <>
      <div className={`my-4 p-4 ${index % 2 == 0 && "bg-gray-50 dark:bg-gray-800"}`}>
        <div className="workquote gap-x-4">
          <WorkMetadata submission={submission} />
          <WorkComment submission={submission} index={index} />
        </div>
      </div>
    </>
  )
}

export default ViewWorkCard

const WorkMetadata = ({ submission }) => {
  return (
    <div>
      <h2 className="my-1 text-lg line-clamp-3">
        <a
          href={`https://doi.org/${submission.module.prefix}/${submission.module.suffix}`}
          target="_blank"
          rel="noreferrer"
        >
          {submission.module.title}
        </a>
      </h2>
      <DoiSubmission submission={submission} />
      <p className="my-1 text-sm">Collected {moment(submission.updatedAt).fromNow()}</p>
      <p className="my-1 text-sm">
        Originally published {moment(submission.module.publishedAt!).fromNow()}
      </p>
      {submission.submittedBy && (
        <p className="text-xs">
          Submitted by{" "}
          <Link href={Routes.HandlePage({ handle: submission.submittedBy.handle })} target="_blank">
            {submission.submittedBy!.firstName && submission.submittedBy!.lastName
              ? `${submission.submittedBy!.firstName} ${submission.submittedBy!.lastName}`
              : submission.submittedBy.handle}
            {/* {submission.editor!.workspace.firstName} {submission.editor!.workspace.lastName} */}
          </Link>
        </p>
      )}
    </div>
  )
}

const WorkComment = ({ submission, index }) => {
  return (
    <div id={`submission-comment-${submission.id}-${index}`}>
      {submission.comment && submission.comment != "" && (
        <>
          {/* for inspiration https://shuffle.dev/components/all/all/testimonials */}
          <blockquote className="my-4 border-l-2 border-indigo-600 bg-indigo-100 p-2 font-serif text-xl italic dark:border-indigo-500 dark:bg-indigo-800 sm:my-1">
            {submission.comment}
          </blockquote>
          {submission.editor && (
          <div className="my-2 flex w-full">
            <span className="flex">
              <img
                src={submission.editor!.workspace!.avatar!}
                alt={`Avatar of ${submission.editor!.workspace.firstName}
            ${submission.editor!.workspace.lastName}`}
                className="mx-1 inline-block h-8 h-full w-8 rounded-full align-middle"
              />
              <div className="mx-1 inline-block h-full align-middle">
                <span className="inline-block h-full align-middle"></span>
                <Link
                  href={Routes.HandlePage({ handle: submission.editor.workspace.handle })}
                  target="_blank"
                >
                  {submission.editor!.workspace.firstName} {submission.editor!.workspace.lastName}
                </Link>
              </div>
            </span>
            <span className="flex-grow"></span>
          </div>)}
        </>
      )}

      {/* Tweet button */}
      {/* https://developer.twitter.com/en/docs/twitter-for-websites/tweet-button/guides/web-intent */}
    </div>
  )
}
