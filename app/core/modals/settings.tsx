import { Dialog, Transition, Tab } from "@headlessui/react"
import { Fragment, useEffect, useState } from "react"
import { XIcon } from "@heroicons/react/solid"
import WorkspaceSettings from "../components/WorkspaceSettings"
import AccountSettings from "../components/AccountSettings"

function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

export default function SettingsModal({ button, styling, user, workspace }) {
  let [isOpen, setIsOpen] = useState(false)
  let [categories] = useState(["Workspace", "Account"])

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setIsOpen(true)
        }}
        className={styling}
      >
        {button}
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed  inset-0 z-10 overflow-y-auto"
          onClose={() => {
            setIsOpen(false)
          }}
        >
          <div className="min-h-screen text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-900 bg-opacity-25 transition-opacity" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="hidden sm:inline-block h-screen max-h-screen align-middle"
              aria-hidden="true"
            >
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
              <div className="inline-block w-full min-h-screen sm:min-h-full  sm:w-auto sm:min-w-120 sm:max-w-120  text-left align-middle transition-all transform rounded bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 shadow text-gray-900">
                <div className="sm:w-120">
                  <Tab.Group>
                    <Dialog.Title
                      as="div"
                      className="text-sm leading-5 font-normal text-gray-900 dark:text-gray-200 sticky top-0 border-b border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 rounded-t"
                    >
                      <h1 className="p-2 sm:hidden text-lg leading-7 font-medium text-gray-900 dark:text-gray-200 px-2">
                        Settings
                      </h1>
                      <Tab.List className="flex p-1 space-x-1 z-10 bg-white dark:bg-gray-900 rounded-t">
                        {categories.map((category) => (
                          <Tab
                            key={category}
                            className={({ selected }) =>
                              classNames(
                                "w-full py-2",
                                "focus:outline-none focus:ring-2 ring-offset-2 ring-offset-indigo-400 ring-transparent ring-opacity-60 rounded",
                                selected
                                  ? "bg-gray-100 dark:bg-gray-800"
                                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
                              )
                            }
                          >
                            {category}
                          </Tab>
                        ))}
                        <button className="rounded-md p-2 inline-flex  items-center justify-center text-gray-500 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                          <span className="sr-only">Close menu</span>
                          <XIcon
                            className="h-6 w-6"
                            aria-hidden="true"
                            onClick={() => {
                              setIsOpen(false)
                            }}
                          />
                        </button>
                      </Tab.List>
                    </Dialog.Title>

                    {/* Workspace tab */}
                    <Tab.Panels className="mt-2 mb-0">
                      <Tab.Panel key="workspace-panel" className="">
                        <WorkspaceSettings workspace={workspace} setIsOpen={setIsOpen} />
                      </Tab.Panel>
                      {/* Account tab */}
                      <Tab.Panel key="account-panel" className="">
                        <AccountSettings user={user} setIsOpen={setIsOpen} />
                      </Tab.Panel>
                    </Tab.Panels>
                  </Tab.Group>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
