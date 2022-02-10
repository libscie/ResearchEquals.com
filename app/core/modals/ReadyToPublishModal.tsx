import publishModule from "app/modules/mutations/publishModule"
import { useMutation, useRouter } from "blitz"
import { Fragment, useState } from "react"
import { Dialog, Transition } from "@headlessui/react"

export default function ReadyToPublish({ module }) {
  let [isOpen, setIsOpen] = useState(false)
  const [publishMutation] = useMutation(publishModule)
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
        className="bg-indigo-500 px-4 py-2 text-white hover:bg-indigo-300"
        onClick={openModal}
        // async () => {
        //   await publishMutation({ id: module.id })
        //   router.reload()
        // }}
      >
        Publish
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
              <div className="my-8 inline-block w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                  Confirm
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    When all authors approve the current version, the research module will be
                    automatically published.
                  </p>
                  <p className="text-sm text-gray-500">
                    If any of your co-authors makes a change, you will have to re-approve for
                    publication.
                  </p>
                </div>

                <div className="mt-4">
                  <button
                    type="button"
                    className="mr-4 inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={async () => {
                      await publishMutation({ id: module.id })
                      router.reload()
                      // closeModal()
                    }}
                  >
                    Approve for publishing
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
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
