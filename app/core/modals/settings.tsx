import { Dialog, Transition, Tab } from "@headlessui/react"
import { Fragment, useState } from "react"
import { Close32 } from "@carbon/icons-react"

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
          className="fixed inset-0 z-10 overflow-y-auto"
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
              className="hidden h-screen max-h-screen align-middle sm:inline-block"
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
              <div className="sm:min-w-120 sm:max-w-120 inline-block min-h-screen  w-full transform rounded  border border-gray-300 bg-white text-left align-middle text-gray-900 shadow transition-all dark:border-gray-600 dark:bg-gray-900 sm:min-h-full sm:w-auto">
                <div className="sm:w-120">
                  <Tab.Group>
                    <Dialog.Title
                      as="div"
                      className="sticky top-0 rounded-t border-b border-gray-300 bg-white text-sm font-normal leading-5 text-gray-900 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200"
                    >
                      <h1 className="p-2 px-2 text-lg font-medium leading-7 text-gray-900 dark:text-gray-200 sm:hidden">
                        Settings
                      </h1>
                      <Tab.List className="z-10 flex space-x-1 rounded-t bg-white p-1 dark:bg-gray-900">
                        {categories.map((category) => (
                          <Tab
                            key={category}
                            className={({ selected }) =>
                              classNames(
                                "w-full py-2",
                                "rounded ring-transparent ring-opacity-60 ring-offset-2 ring-offset-indigo-400 focus:outline-none focus:ring-2",
                                selected
                                  ? "bg-gray-100 dark:bg-gray-800"
                                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
                              )
                            }
                          >
                            {category}
                          </Tab>
                        ))}
                        <button className="inline-flex items-center justify-center  rounded-md p-2 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 dark:text-gray-500 dark:hover:text-gray-300">
                          <span className="sr-only">Close menu</span>
                          <Close32
                            className="h-6 w-6"
                            aria-hidden="true"
                            onClick={() => {
                              setIsOpen(false)
                            }}
                          />
                        </button>
                      </Tab.List>
                    </Dialog.Title>

                    <Tab.Panels className="mt-2 mb-0">
                      <Tab.Panel key="workspace-panel" className="">
                        <WorkspaceSettings workspace={workspace} setIsOpen={setIsOpen} />
                      </Tab.Panel>
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
