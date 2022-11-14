import { useRouter } from "next/router";
import { useMutation } from "@blitzjs/rpc";
import { Fragment, useState } from "react"
import { Dialog, Transition } from "@headlessui/react"
import deleteModule from "app/modules/mutations/deleteModule"
import toast from "react-hot-toast"

export default function DeleteModule({ module, setModule, fetchDrafts }) {
  let [isOpen, setIsOpen] = useState(false)
  const [deleteModuleMutation] = useMutation(deleteModule)
  const router = useRouter()

  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
  }

  return (
    <>
      <button
        className="mx-4 rounded-md bg-red-100 py-2 px-4 text-sm font-medium leading-4 text-red-700 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-0 dark:border dark:border-gray-600 dark:bg-gray-800 dark:text-red-500 dark:hover:border-gray-400 dark:hover:bg-gray-700"
        onClick={openModal}
      >
        Delete module
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
                  Confirm module deletion
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm">
                    The module will be deleted once you verify. No co-author approval is needed to
                    do this.
                  </p>
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    className="mr-2 inline-flex rounded-md bg-red-50 py-2 px-4 text-sm font-medium text-red-700 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-0 dark:border dark:border-gray-600 dark:bg-gray-800 dark:text-red-500 dark:hover:border-gray-400 dark:hover:bg-gray-700"
                    onClick={async () => {
                      toast
                        .promise(deleteModuleMutation({ id: module.id }), {
                          loading: "Deleting...",
                          success: "Deleted!",
                          error: "Something went wrong...",
                        })
                        .then(fetchDrafts)
                        .then(() => {
                          router.push("/drafts")
                          setModule(undefined)
                          closeModal()
                        })
                    }}
                  >
                    Delete
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
