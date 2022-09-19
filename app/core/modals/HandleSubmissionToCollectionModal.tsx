import { useMutation } from "blitz"
import { Fragment, useState } from "react"
import { Dialog, Transition } from "@headlessui/react"
import toast from "react-hot-toast"
import { CheckmarkFilled, CloseFilled } from "@carbon/icons-react"
import handleSubmission from "../../collections/mutations/handleSubmission"

export default function AcceptSubmissionToCollectionModal({
  submission,
  editorId,
  accept,
  refetchFn,
}) {
  let [isOpen, setIsOpen] = useState(false)
  const [handleSubmissionActiveMutation] = useMutation(handleSubmission)

  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
  }

  return (
    <>
      <button
        // className="mx-4 rounded-md bg-red-100 py-2 px-4 text-sm font-medium leading-4 text-red-700 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-0 dark:border dark:border-gray-600 dark:bg-gray-800 dark:text-red-500 dark:hover:border-gray-400 dark:hover:bg-gray-700"
        onClick={openModal}
      >
        <label
          htmlFor={`${accept ? "accept" : "decline"}-submission-${submission.id}`}
          className="sr-only"
        >
          {accept ? "Accept" : "Decline"} &quot;{submission.module.title}&quot; to collection
        </label>
        {accept ? (
          <CheckmarkFilled
            size={32}
            id={`accept-submission-${submission.id}`}
            className="fill-current text-green-600"
          />
        ) : (
          <CloseFilled
            size={32}
            id={`decline-submission-${submission.id}`}
            className="fill-current text-red-600"
          />
        )}
      </button>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={closeModal}>
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span className="inline-block h-screen align-middle" aria-hidden="true">
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="my-8 inline-block w-full max-w-md transform overflow-hidden rounded border-gray-300 bg-white p-6 text-left align-middle text-gray-900 shadow-xl transition-all dark:border dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6">
                  Confirm
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm">
                    Please confirm that you would like to {accept ? "accept" : "decline"} this
                    submission.
                  </p>
                  <p className="text-sm">{accept && "You can add an editor's note afterwards."}</p>
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    className={`${
                      accept
                        ? "bg-green-50 text-green-700 hover:bg-green-200 focus:ring-green-500 dark:text-green-500"
                        : "bg-red-50 text-red-700 hover:bg-red-200 focus:ring-red-500 dark:text-red-500"
                    } mr-2 inline-flex rounded-md py-2 px-4 text-sm font-medium focus:outline-none focus:ring-2  focus:ring-offset-0 dark:border dark:border-gray-600 dark:bg-gray-800 dark:hover:border-gray-400 dark:hover:bg-gray-700`}
                    onClick={async () => {
                      toast.promise(
                        handleSubmissionActiveMutation({
                          submissionId: submission.id,
                          editorId,
                          acceptedStatus: accept,
                        }),
                        {
                          loading: `${accept ? "Accepting" : "Declining"} submission`,
                          success: () => {
                            refetchFn()
                            closeModal()
                            return `${accept ? "Accepted" : "Declined"} submission!`
                          },
                          error: `Failed to ${accept ? "accept" : "decline"} submission...`,
                        }
                      )
                    }}
                  >
                    {accept ? "Accept" : "Decline"} Submission
                  </button>
                  <button
                    type="button"
                    className="rounded-md bg-indigo-100 py-2 px-4 text-sm font-medium text-indigo-700 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0 dark:border dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:border-gray-400 dark:hover:bg-gray-700"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
