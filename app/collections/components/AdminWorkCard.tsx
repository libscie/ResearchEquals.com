import Link from "next/link"
import { useMutation } from "@blitzjs/rpc"
import { Routes } from "@blitzjs/next"
import DeleteSubmissionModal from "app/core/modals/DeleteSubmissionModal"
import { Field, Form, Formik } from "formik"
import moment from "moment"
import { LogoTwitter, WatsonHealthSaveAnnotation } from "@carbon/icons-react"
import addComment from "../mutations/addComment"
import DoiSubmission from "./DoiSubmission"
import { toast } from "react-hot-toast"

const AdminWorkCard = ({ submission, index, editorIdSelf, editorIsAdmin, refetchFn }) => {
  return (
    <>
      <div className={`my-4 p-4 ${index % 2 === 0 && "bg-gray-50 dark:bg-gray-800"}`}>
        <div className="workquote gap-x-4">
          <WorkMetadata
            submission={submission}
            editorIsAdmin={editorIsAdmin}
            refetchFn={refetchFn}
          />
          <WorkComment
            submission={submission}
            editorIdSelf={editorIdSelf}
            index={index}
            refetchFn={refetchFn}
            editorIsAdmin={editorIsAdmin}
          />
        </div>
      </div>
    </>
  )
}

export default AdminWorkCard

const WorkMetadata = ({ submission, editorIsAdmin, refetchFn }) => {
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
          </Link>
        </p>
      )}
      {editorIsAdmin && (
        <DeleteSubmissionModal submissionId={submission.id} refetchFn={refetchFn} />
      )}
    </div>
  )
}

const WorkComment = ({ submission, index, editorIdSelf, refetchFn, editorIsAdmin }) => {
  const [addCommentMutation] = useMutation(addComment)

  return (
    <div id={`submission-comment-${submission.id}-${index}`}>
      {submission.editor && submission.editor!.id === editorIdSelf && submission.comment === null && (
        <>
          <Formik
            initialValues={{
              comment: "",
            }}
            onSubmit={async (values) => {
              await toast.promise(
                addCommentMutation({
                  id: submission.id,
                  comment: values.comment,
                }),
                {
                  loading: "Adding comment",
                  success: (data) => {
                    refetchFn()

                    return "Added comment!"
                  },
                  error: (err) => {
                    return `${err}`
                  },
                }
              )
            }}
          >
            <Form className="flex h-full">
              <label
                htmlFor={`submission-comment-${submission.id}-${index}-form`}
                className="sr-only"
              >
                comment
              </label>
              <Field
                id={`submission-comment-${submission.id}-${index}-form`}
                name="comment"
                placeholder="Editor's comment (max 280 characters). Hit save without any comment if you don't want to add a note and this box will disappear."
                type="text"
                component="textarea"
                rows={3}
                className="placeholder-font-normal block w-full appearance-none rounded-md border border-gray-400 bg-white px-3 py-2 text-sm font-normal placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0 dark:border-gray-600 dark:bg-transparent dark:text-gray-200 "
              />
              <button className="ml-2 whitespace-nowrap font-medium underline" type="submit">
                <label
                  htmlFor={`submission-comment-${submission.id}-${index}-button`}
                  className="sr-only"
                >
                  Save comment
                </label>
                <WatsonHealthSaveAnnotation
                  size={32}
                  id={`submission-comment-${submission.id}-${index}-button`}
                />
              </button>
            </Form>
          </Formik>
        </>
      )}
      {submission.comment && submission.comment != "" && (
        <>
          {/* for inspiration https://shuffle.dev/components/all/all/testimonials */}
          <blockquote className="my-1 border-l-2 border-indigo-600 bg-indigo-100 p-2 font-serif text-xl italic dark:border-indigo-500 dark:bg-indigo-800">
            {submission.comment}
          </blockquote>
          {submission.editor && (<div className="my-2 flex w-full">
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
