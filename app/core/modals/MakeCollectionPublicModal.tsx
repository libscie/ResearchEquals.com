import { useMutation } from "blitz"
import { Fragment, useState } from "react"
import { Dialog, Transition } from "@headlessui/react"
import toast from "react-hot-toast"
import { CheckmarkOutline } from "@carbon/icons-react"

import makePublic from "../../collections/mutations/makePublic"

export default function MakeCollectionPublicModal({ collection, refetchFn, workspace }) {
  let [isOpen, setIsOpen] = useState(false)
  const [makePublicMutation] = useMutation(makePublic)

  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
  }

  // Get current user's role in this collection
  const currentEditorship = workspace.editorships.find((e) => e.collectionId === collection.id)
  const currentRole = currentEditorship.role

  return (
    <>
      <div className="sticky top-0 z-50 flex w-full bg-amber-50 py-4 px-2 text-center dark:bg-amber-800">
        <div className="mx-auto flex">
          <div className="inline-block align-middle">
            <CheckmarkOutline
              size={32}
              className="inline-block h-5 w-5 stroke-current align-middle text-amber-500 dark:text-amber-200"
              aria-hidden="true"
            />
          </div>
          <div className="mx-3 text-amber-800 dark:text-amber-100">
            <h3 className="inline-block align-middle text-sm font-normal leading-4 text-amber-800 dark:text-amber-100">
              This collection is not yet public.
            </h3>
          </div>
          <div className="">
            {currentRole !== "USER" && (
              <button
                type="button"
                className="rounded border border-amber-500 px-2 py-1.5 text-sm font-medium leading-4 text-amber-500 hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:ring-offset-2 focus:ring-offset-amber-50 dark:border-amber-200 dark:text-amber-200 dark:hover:bg-amber-900"
                onClick={openModal}
              >
                Make public
              </button>
            )}
          </div>
        </div>
      </div>

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
                    Once you make the collection public you cannot change the title and subtitle
                    {collection.type.type !== "COMMUNITY" && " (except after upgrading)"}.
                  </p>
                  {!collection.title ? (
                    <p className="text-sm">
                      You cannot make this collection public yet. Please add a title first.
                    </p>
                  ) : (
                    <p className="text-sm">
                      Please confirm you want to make the collection public.
                    </p>
                  )}
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    className="mr-2 inline-flex rounded-md bg-amber-50 py-2 px-4 text-sm font-medium text-amber-700 hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 dark:border dark:border-gray-600 dark:bg-gray-800 dark:text-amber-500 dark:hover:border-gray-400 dark:hover:bg-gray-700"
                    disabled={!collection.title && true}
                    onClick={async () => {
                      toast.promise(makePublicMutation({ collectionId: collection.id }), {
                        loading: "Making public...",
                        success: () => {
                          refetchFn()
                          closeModal()
                          return "Collection is now public!"
                        },
                        error: "Something went wrong...",
                      })
                    }}
                  >
                    Make public
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
