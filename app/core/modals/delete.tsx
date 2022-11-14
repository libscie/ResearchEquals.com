import { useMutation } from "@blitzjs/rpc";
import { useRouter } from "next/router";
import { Fragment, useState } from "react"
import { Dialog, Transition } from "@headlessui/react"

import deleteUser from "app/users/mutations/deleteUser"
import { TrashCan } from "@carbon/icons-react"

export default function DeleteModal() {
  let [isOpen, setIsOpen] = useState(false)
  const [deleteUserMutation] = useMutation(deleteUser)
  const router = useRouter()

  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
  }

  return (
    <>
      <h3 className="text-sm font-medium text-gray-900 dark:text-gray-200">Delete your account</h3>
      <div className="flex w-11/12">
        <div className="">
          <div className="my-2 text-xs text-gray-900 dark:text-gray-200">
            <p>
              Your publication profile and publications will not be deleted if you have published.
            </p>
          </div>
        </div>
        <div className="my-0">
          <button
            type="button"
            className="flex rounded-md bg-red-50 py-2 px-4 text-sm font-medium text-red-700 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-0 dark:border dark:border-gray-600 dark:bg-gray-800 dark:text-red-500 dark:hover:border-gray-400 dark:hover:bg-gray-700"
            onClick={openModal}
          >
            <TrashCan size={32} className="h-5 w-5 fill-current text-red-500" aria-hidden="true" />
            Delete
          </button>
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
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 ">
                    Confirm account deletion
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm">
                      Your account will be deleted without recovery options. Your published modules
                      will not be deleted. Your workspace will only be deleted if there are no
                      published modules linked to it.
                    </p>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="mr-2 rounded-md bg-red-50 py-2 px-4 text-sm font-medium text-red-700 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-0 dark:border dark:border-gray-600 dark:bg-gray-800 dark:text-red-500 dark:hover:border-gray-400 dark:hover:bg-gray-700"
                      onClick={async () => {
                        try {
                          await deleteUserMutation()
                          router.push("/")
                        } catch (err) {
                          throw err
                        }
                      }}
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      className="rounded-md bg-indigo-100 py-2 px-4 text-sm font-medium text-indigo-700 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0 dark:border dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:border-gray-400 dark:hover:bg-gray-700"
                      onClick={async () => {
                        setIsOpen(false)
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>
      </div>
    </>
  )
}
