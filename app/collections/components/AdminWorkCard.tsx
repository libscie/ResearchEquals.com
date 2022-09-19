import DeleteSubmissionModal from "app/core/modals/DeleteSubmissionModal"
import { Field, Form, Formik } from "formik"
import moment from "moment"
import { LogoTwitter } from "@carbon/icons-react"
import addComment from "../mutations/addComment"
import { Link, Routes, useMutation } from "blitz"
import DoiSubmission from "./DoiSubmission"

const AdminWorkCard = ({ submission, index, editorIdSelf, editorIsAdmin, refetchFn }) => {
  return (
    <>
      <div className={`my-4 ${index % 2 === 0 && "bg-gray-50 dark:bg-gray-800"}`}>
        <div className="workquote gap-x-4">
          <WorkMetadata submission={submission} />
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
          <Link href={Routes.HandlePage({ handle: submission.editor.workspace.handle })}>
            <a target="_blank">
              {submission.editor!.workspace.firstName} {submission.editor!.workspace.lastName}
            </a>
          </Link>
        </p>
      )}
    </div>
  )
}

const WorkComment = ({ submission, index, editorIdSelf, refetchFn, editorIsAdmin }) => {
  const [addCommentMutation] = useMutation(addComment)

  return (
    <div id={`submission-comment-${submission.id}-${index}`}>
      {submission.editor!.id === editorIdSelf && submission.comment === null && (
        <>
          <Formik
            initialValues={{
              comment: "",
            }}
            onSubmit={async (values) => {
              try {
                await addCommentMutation({
                  id: submission.id,
                  comment: values.comment,
                })
                refetchFn()
              } catch (error) {
                alert("Error saving product")
              }
            }}
          >
            <Form>
              <label
                htmlFor={`submission-comment-${submission.id}-${index}-form`}
                className="sr-only"
              >
                comment
              </label>
              <Field
                id={`submission-comment-${submission.id}-${index}-form`}
                name="comment"
                placeholder="comment"
                type="text"
                component="textarea"
                rows={3}
                className="placeholder-font-normal block w-full appearance-none rounded-md border border-gray-400 bg-white px-3 py-2 text-sm font-normal placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0 dark:border-gray-600 dark:bg-transparent dark:text-gray-200 "
              />
              {false ? (
                <button className="whitespace-nowrap font-medium underline" type="submit">
                  Thanks!
                </button>
              ) : (
                <button className="whitespace-nowrap font-medium underline" type="submit">
                  Save comment <span aria-hidden="true">&rarr;</span>
                </button>
              )}
            </Form>
          </Formik>
        </>
      )}
      <div className="">
        {submission.comment && submission.comment != "" && (
          <>
            {/* for inspiration https://shuffle.dev/components/all/all/testimonials */}
            <blockquote className=" my-1 border-l-2 border-indigo-600 bg-indigo-100 p-2 font-serif text-xl italic dark:border-indigo-500 dark:bg-indigo-800">
              {submission.comment}
            </blockquote>
            <p className="my-1 flex w-full">
              <span className="mx-auto flex">
                <img
                  src={submission.editor!.workspace!.avatar!}
                  alt={`Avatar of ${submission.editor!.workspace.firstName}
            ${submission.editor!.workspace.lastName}`}
                  className="mx-1 inline-block h-8 h-full w-8 rounded-full align-middle"
                />
                <div className="mx-1 inline-block h-full align-middle">
                  <Link href={Routes.HandlePage({ handle: submission.editor.workspace.handle })}>
                    <a target="_blank">
                      {submission.editor!.workspace.firstName}{" "}
                      {submission.editor!.workspace.lastName}
                    </a>
                  </Link>
                </div>
                {submission.comment && submission.comment != "" && (
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                      submission.comment
                    )}&via=ResearchEquals
              `}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <LogoTwitter size={24} className="fill-current text-indigo-400" />
                  </a>
                )}
              </span>
              {editorIsAdmin && (
                <DeleteSubmissionModal submissionId={submission.id} refetchFn={refetchFn} />
              )}
            </p>
          </>
        )}

        {/* Tweet button */}
        {/* https://developer.twitter.com/en/docs/twitter-for-websites/tweet-button/guides/web-intent */}
      </div>
    </div>
  )
}
