import { Link, Routes, useMutation } from "blitz"
import { Menu, Popover, Transition } from "@headlessui/react"
import { Fragment } from "react"
import { Add, Settings, Notification, NotificationNew } from "@carbon/icons-react"

import logout from "../../auth/mutations/logout"
import SettingsModal from "../modals/settings"
import QuickDraft from "../../modules/components/QuickDraft"
import InvitationNotification from "./InvitationNotification"

const FullWidthMenu = ({
  currentUser,
  session,
  router,
  currentWorkspace,
  invitedModules,
  refetchFn,
}) => {
  const [logoutMutation] = useMutation(logout)

  console.log(currentUser)

  if (currentUser && currentWorkspace) {
    return (
      <div className="hidden lg:flex lg:items-center lg:justify-end xl:col-span-4">
        <Popover className="relative">
          {({ open }) => (
            <>
              <Popover.Button
                className={`
                ${open ? "" : "text-opacity-90"}
                mx-0 shrink-0 rounded-full p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
                ${invitedModules.length > 0 ? "" : "pointer-events-none"}
                `}
              >
                <span className="sr-only">View notifications</span>
                {invitedModules.length > 0 ? (
                  <NotificationNew size={32} className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <Notification
                    size={32}
                    className="h-6 w-6 cursor-not-allowed"
                    aria-hidden="true"
                  />
                )}
              </Popover.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <Popover.Panel className="max-w-72 absolute left-1/2 z-10 mt-3 w-72 -translate-x-1/2 transform rounded-md bg-white px-4 shadow-lg ring-1 ring-gray-400 ring-opacity-5 dark:bg-gray-800 dark:ring-gray-600 dark:ring-opacity-100 sm:px-0">
                  <ul className="divide-y dark:divide-gray-600">
                    {invitedModules.map((invited) => (
                      <>
                        <InvitationNotification invited={invited} />
                      </>
                    ))}
                  </ul>
                </Popover.Panel>
              </Transition>
            </>
          )}
        </Popover>
        <span className="sr-only">Open settings</span>
        <SettingsModal
          styling="ml-1 shrink-0 p-1 text-gray-400 hover:text-gray-500 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 "
          button={
            <Settings
              size={32}
              className="flex h-6 w-6 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              aria-hidden="true"
            />
          }
          user={currentUser}
          workspace={currentWorkspace}
        />
        <Menu as="div" className="relative ml-2 shrink-0">
          <div>
            <Menu.Button className="flex rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
              <span className="sr-only">Open user menu</span>
              <img
                className="h-8 w-8 rounded-full hover:outline-none hover:ring-2 hover:ring-indigo-500 hover:ring-offset-2"
                src={currentWorkspace.avatar!}
                alt={`Avatar of ${currentWorkspace.handle}`}
              />
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800 dark:ring-gray-600 dark:ring-opacity-100">
              <Menu.Item key="dropdown-profile">
                {({ active }) => (
                  <button
                    className={`${
                      active ? "bg-gray-100 text-gray-900 dark:bg-gray-700 " : "text-gray-500"
                    }
               block w-full py-2 px-4 text-left text-sm font-normal leading-5 dark:text-gray-200`}
                    onClick={async () => {
                      router.push(Routes.HandlePage({ handle: currentWorkspace.handle }))
                    }}
                  >
                    Profile
                  </button>
                )}
              </Menu.Item>
              {currentUser.role === "SUPERADMIN"}
              <Menu.Item key="dropdown-superadmin">
                {({ active }) => (
                  <button
                    className={`${
                      active ? "bg-gray-100 text-gray-900 dark:bg-gray-700 " : "text-gray-500"
                    }
               block w-full py-2 px-4 text-left text-sm font-normal leading-5 dark:text-gray-200`}
                    onClick={async () => {
                      router.push(Routes.Admin())
                    }}
                  >
                    Admin
                  </button>
                )}
              </Menu.Item>
              <Menu.Item key="dropdown-logout">
                {({ active }) => (
                  <button
                    className={`${
                      active ? "bg-gray-100 text-gray-900 dark:bg-gray-700 " : "text-gray-500"
                    }
               block w-full py-2 px-4 text-left text-sm font-normal leading-5 dark:text-gray-200`}
                    onClick={async () => {
                      await logoutMutation()
                    }}
                  >
                    Logout
                  </button>
                )}
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
        <QuickDraft
          buttonText={
            <>
              <Add
                size={32}
                className="h-4 w-4 fill-current text-indigo-500 dark:text-gray-400"
                aria-hidden="true"
              />
              Draft
            </>
          }
          buttonStyle="bg-indigo-50 dark:bg-gray-800 text-indigo-700 dark:text-gray-200 ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-normal rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:border dark:border-gray-400 dark:hover:bg-gray-700"
          refetchFn={refetchFn}
        />
      </div>
    )
  } else {
    return (
      <div className="hidden lg:flex lg:items-center lg:justify-end xl:col-span-4">
        <Link href={Routes.LoginPage()}>
          <a className="whitespace-nowrap rounded border-0 bg-indigo-100 px-4 py-2 text-sm font-normal leading-5 text-indigo-700 hover:bg-indigo-200 dark:border dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700">
            Log in
          </a>
        </Link>
        <Link href={Routes.SignupPage()}>
          <a className="ml-2 inline-flex items-center justify-center whitespace-nowrap rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-normal leading-5 text-white shadow-sm hover:bg-indigo-700 2xl:ml-8">
            Create account
          </a>
        </Link>
      </div>
    )
  }
}

export default FullWidthMenu
