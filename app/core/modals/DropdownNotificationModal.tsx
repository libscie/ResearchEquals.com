import { Listbox, Transition, Dialog } from "@headlessui/react"
import { Close32, Menu32, NotificationNew32, Notification32 } from "@carbon/icons-react"

import { Fragment, useState } from "react"
import ResearchEqualsLogo from "../components/ResearchEqualsLogo"
import { Link } from "blitz"
import moment from "moment"
import InvitationNotification from "../components/InvitationNotification"

const DropdownNotificationModal = ({ invitedModules }) => {
  let [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        className="relative focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 rounded-full w-10 h-10"
        onClick={() => {
          setIsOpen(true)
        }}
        disabled={invitedModules.length === 0}
      >
        <span className="inline-block h-full align-middle"></span>

        {invitedModules.length > 0 ? (
          <NotificationNew32
            className="inline-block align-middle stroke-current text-gray-400 h-6 w-6"
            aria-hidden="true"
          />
        ) : (
          <Notification32
            className="inline-block align-middle stroke-current text-gray-400 h-6 w-6"
            aria-hidden="true"
          />
        )}
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

            <Transition.Child
              as={Fragment}
              enter="ease-out duration-100"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block min-h-screen w-full my-0 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-900 shadow-xl border-b dark:border-gray-600">
                <Dialog.Title as="h1" className="text-lg font-medium leading-6 text-gray-900">
                  <div className="pt-0 pb-0 px-0">
                    <div className="flex items-center justify-between p-2 border-b border-gray-400 dark:border-gray-600">
                      <h1 className="text-lg leading-7 font-medium text-gray-900 dark:text-gray-200 px-2">
                        Notifications
                      </h1>
                      <div className="mr-2">
                        <button
                          className="rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:text-gray-200 dark:hover:text-white dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                          onClick={() => {
                            setIsOpen(false)
                          }}
                        >
                          <span className="sr-only">Close menu</span>
                          <Close32 className="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                    <ul className="divide-y divide-gray-400 dark:divide-gray-600">
                      {invitedModules.map((invited) => (
                        <>
                          <div className="px-2">
                            <InvitationNotification invited={invited} />
                          </div>
                        </>
                      ))}
                    </ul>
                  </div>
                </Dialog.Title>
                <div className="items-center justify-between"></div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default DropdownNotificationModal
