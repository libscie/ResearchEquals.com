import { useMutation } from "blitz"
import { Fragment, useState } from "react"
import { Dialog, Transition } from "@headlessui/react"
import toast from "react-hot-toast"
import { Logout } from "@carbon/icons-react"
import changeEditorActive from "../../collections/mutations/changeEditorActive"

export default function SetEditorToInactiveModal({ editor, refetchFn }) {
  let [isOpen, setIsOpen] = useState(false)
  const [changeEditorActiveMutation] = useMutation(changeEditorActive)

  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
  }

  return (
    <>
      <button onClick={openModal}>
        <label htmlFor="search" className="sr-only">
          Set editor to {`${editor.isActive ? "inactive" : "active"}`}
        </label>
        <Logout
          size={32}
          id="search"
          className={`${
            editor.isActive ? "" : "rotate-180"
          } "ml-2 shrink-0 p-1 text-gray-900 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:text-gray-200 dark:hover:text-gray-300
`}
        />
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
                  Confirm editor {`${editor.isActive ? "deactivation" : "activation"}`}
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm">
                    {`${
                      editor.isActive
                        ? "This editor will no longer be able to edit this collection. They can be reactivated by an admin at any time."
                        : "This editor will be able to edit this collection. They can be deactivated by an admin at any time."
                    }`}
                  </p>
                </div>
                <div className="mt-4">
                  {editor.isActive ? (
                    <button
                      type="button"
                      className="mr-2 inline-flex rounded-md bg-red-50 py-2 px-4 text-sm font-medium text-red-700 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-0 dark:border dark:border-gray-600 dark:bg-gray-800 dark:text-red-500 dark:hover:border-gray-400 dark:hover:bg-gray-700"
                      onClick={async () => {
                        toast.promise(
                          changeEditorActiveMutation({
                            editorId: editor.id,
                            active: !editor.isActive,
                          }),
                          {
                            loading: `Setting to ${editor.isActive ? "inactive" : "active"}...`,
                            success: () => {
                              // alert("success")
                              refetchFn()
                              closeModal()
                              return `Changed to ${editor.isActive ? "inactive" : "active"}!`
                            },
                            error: "Failed to change activity...",
                          }
                        )
                      }}
                    >
                      Set to inactive
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="mr-2 inline-flex rounded-md bg-green-50 py-2 px-4 text-sm font-medium text-green-700 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-0 dark:border dark:border-gray-600 dark:bg-gray-800 dark:text-green-500 dark:hover:border-gray-400 dark:hover:bg-gray-700"
                      onClick={async () => {
                        toast.promise(
                          changeEditorActiveMutation({
                            editorId: editor.id,
                            active: !editor.isActive,
                          }),
                          {
                            loading: `Setting to ${editor.isActive ? "inactive" : "active"}...`,
                            success: () => {
                              // alert("success")
                              refetchFn()
                              closeModal()
                              return `Changed to ${editor.isActive ? "inactive" : "active"}!`
                            },
                            error: "Failed to change activity...",
                          }
                        )
                      }}
                    >
                      Set to active
                    </button>
                  )}
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
