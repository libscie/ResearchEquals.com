import { useMutation } from "@blitzjs/rpc";
import { Fragment, useState } from "react"
import { Dialog, Transition } from "@headlessui/react"
import toast from "react-hot-toast"
import { CheckmarkOutline } from "@carbon/icons-react"

import makePublic from "../../collections/mutations/makePublic"
import upgradeCollection from "../../collections/mutations/upgradeCollection"

export default function FinalizeUpgradeModal({ collection, refetchFn }) {
  let [isOpen, setIsOpen] = useState(false)
  const [upgradeCollectionMutation] = useMutation(upgradeCollection)

  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
  }

  return (
    <>
      <div className="sticky top-0 z-10 flex  w-full bg-pink-50 py-4 px-2 text-center dark:bg-pink-800">
        <div className="mx-auto flex">
          <div className="inline-block align-middle">
            <CheckmarkOutline
              size={32}
              className="inline-block h-5 w-5 stroke-current align-middle text-pink-500 dark:text-pink-200"
              aria-hidden="true"
            />
          </div>
          <div className="mx-3 text-pink-800 dark:text-pink-100">
            <h3 className="inline-block align-middle text-sm font-normal leading-4 text-pink-800 dark:text-pink-100">
              Finish upgrading your collection. Update your title and subtitle.
            </h3>
          </div>
          <div className="">
            <button
              type="button"
              className="rounded border border-pink-500 px-2 py-1.5 text-sm font-medium leading-4 text-pink-500 hover:bg-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-600 focus:ring-offset-2 focus:ring-offset-pink-50 dark:border-pink-200 dark:text-pink-200 dark:hover:bg-pink-900"
              onClick={openModal}
            >
              Upgrade Title
            </button>
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
                    Once you upgrade the collection you cannot change the title and subtitle.
                  </p>
                  <p className="text-sm">
                    Please confirm you want to upgrade the collection to the current title and
                    subtitle.
                  </p>
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    className="mr-2 inline-flex rounded-md bg-pink-50 py-2 px-4 text-sm font-medium text-pink-700 hover:bg-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 dark:border dark:border-gray-600 dark:bg-gray-800 dark:text-pink-500 dark:hover:border-gray-400 dark:hover:bg-gray-700"
                    disabled={!collection.title && true}
                    onClick={async () => {
                      toast.promise(upgradeCollectionMutation({ collectionId: collection.id }), {
                        loading: "Updating collection...",
                        success: () => {
                          refetchFn()
                          closeModal()
                          return "Collection is now upgraded!"
                        },
                        error: "Something went wrong...",
                      })
                    }}
                  >
                    Upgrade Collection
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
