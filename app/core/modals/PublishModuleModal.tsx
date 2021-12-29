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

  console.log(module)
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
              <div className="inline-block rounded w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform shadow-xl text-gray-900 dark:text-gray-200 bg-white dark:bg-gray-900 dark:border border-gray-300 dark:border-gray-600">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6">
                  Confirm publication
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Once you publish this module, you cannot delete it. If you chose a restrictive
                    license, you will be redirected to the payment page to complete the publication.
                  </p>
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center mr-2 py-2 px-4 bg-green-50 dark:bg-gray-800 text-green-700 dark:text-green-500 hover:bg-green-200 dark:hover:bg-gray-700 dark:border dark:border-gray-600 dark:hover:border-gray-400 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-green-500"
                    onClick={async () => {
                      try {
                        await publishModuleMutation({ id: module.id })
                        router.push(`/modules/${module.suffix}`)
                      } catch (error) {
                        toast.error("Module cannot be published. Ensure main file is added.")
                      }
                    }}
                  >
                    Publish
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center mr-2 py-2 px-4 bg-red-50 dark:bg-gray-800 text-red-700 dark:text-red-500 hover:bg-red-200 dark:hover:bg-gray-700 dark:border dark:border-gray-600 dark:hover:border-gray-400 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-red-500"
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
