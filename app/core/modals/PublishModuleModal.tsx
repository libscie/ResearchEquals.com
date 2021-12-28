import { useMutation, useRouter } from "blitz"
import { Fragment, useState } from "react"
import { Dialog, Transition } from "@headlessui/react"

import publishModule from "../../modules/mutations/publishModule"
import toast from "react-hot-toast"
import { CheckCircleIcon } from "@heroicons/react/outline"

export default function PublishModule({ module }) {
  let [isOpen, setIsOpen] = useState(false)
  const [publishModuleMutation] = useMutation(publishModule)
  const router = useRouter()

  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
  }

  return (
    <>
      <div className="rounded-md bg-green-50 dark:bg-green-800 w-full p-2 flex my-4">
        <div className="flex-shrink-0 inline-block align-middle">
          <CheckCircleIcon
            className="stroke-current h-5 w-5 text-green-500 dark:text-green-200 inline-block align-middle"
            aria-hidden="true"
          />
        </div>
        <div className="ml-3 flex-grow text-green-800 dark:text-green-100">
          <h3 className="text-xs leading-4 font-normal text-green-800 dark:text-green-100 inline-block align-middle">
            All authors approved this version for publication. Would you like to (pay and) publish
            it now?
          </h3>
        </div>
        <div className="">
          <button
            type="button"
            className="border rounded border-green-500 text-green-500 dark:border-green-200 dark:text-green-200 px-2 py-1.5 text-xs leading-4 font-medium hover:bg-green-100 dark:hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-50 focus:ring-green-600"
            onClick={openModal}
          >
            Publish module
          </button>
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
              <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
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
              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                  Confirm
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Once you publish this module, you cannot delete it. It may be retracted or
                    corrected at any time.
                  </p>
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-green-900 bg-green-100 border border-transparent rounded-md hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500 mr-4"
                    onClick={async () => {
                      try {
                        await publishModuleMutation({ id: module.id })
                        router.push("/dashboard")
                      } catch (error) {
                        toast.error("Module cannot be published. Ensure main file is added.")
                      }
                      // TODO: Update route to that of module?
                    }}
                  >
                    Publish
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-red-900 bg-red-100 border border-transparent rounded-md hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500"
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
