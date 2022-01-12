import { Link, Routes, useMutation, useSession, useRouter, useQuery } from "blitz"
import { Listbox, Menu, Popover, Transition } from "@headlessui/react"
import { Fragment, useState } from "react"
import { PlusSmIcon, CogIcon } from "@heroicons/react/solid"
import moment from "moment"

import { useCurrentUser } from "../hooks/useCurrentUser"
import { useCurrentWorkspace } from "../hooks/useCurrentWorkspace"
import logout from "../../auth/mutations/logout"
import SettingsModal from "../modals/settings"
import QuickDraft from "../../modules/components/QuickDraft"
import getInvitedModules from "../../workspaces/queries/getInvitedModules"
import { BellIcon } from "@heroicons/react/outline"
import InvitationNotification from "./InvitationNotification"

const FullWidthMenu = () => {
  const currentUser = useCurrentUser()
  const session = useSession()
  const router = useRouter()
  const currentWorkspace = useCurrentWorkspace()
  const [invitedModules] = useQuery(getInvitedModules, { session })
  const [logoutMutation] = useMutation(logout)

  // Match the selected state with the session workspace
  const [selected, setSelected] = useState(
    currentUser?.memberships.filter((membership) => {
      if (membership.workspace.id === session.workspaceId) {
        return membership
      }
    })[0]
  )

  if (currentUser && currentWorkspace) {
    return (
      <div className="hidden lg:flex lg:items-center lg:justify-end xl:col-span-4">
        <Popover className="relative">
          {({ open }) => (
            <>
              <Popover.Button
                className={`
                ${open ? "" : "text-opacity-90"}
                mx-0 flex-shrink-0 p-1 text-gray-400 hover:text-gray-500 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                ${invitedModules.length > 0 ? "" : "pointer-events-none"}
                `}
              >
                <span className="sr-only">View notifications</span>
                {invitedModules.length > 0 ? (
                  <div className="relative">
                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                    <svg
                      className="absolute top-0 right-0 h-2 w-2 text-gray-400 dark:text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 8 8"
                    >
                      <circle cx={4} cy={4} r={3} />
                    </svg>
                  </div>
                ) : (
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
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
                <Popover.Panel className="absolute z-10 max-w-72 w-72 bg-white dark:bg-gray-800 rounded-md ring-1 ring-gray-400 dark:ring-gray-600 ring-opacity-5 dark:ring-opacity-100 px-4 mt-3 transform -translate-x-1/2 left-1/2 sm:px-0 shadow-lg">
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
          styling="ml-1 flex-shrink-0 p-1 text-gray-400 hover:text-gray-500 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 "
          button={
            <CogIcon
              className="h-6 w-6 text-gray-400 hover:text-gray-500 rounded-full flex focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              aria-hidden="true"
            />
          }
          user={currentUser}
          workspace={currentWorkspace}
        />
        <Menu as="div" className="flex-shrink-0 relative ml-2">
          <div>
            <Menu.Button className="rounded-full flex focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <span className="sr-only">Open user menu</span>
              <img
                className="h-8 w-8 rounded-full hover:outline-none hover:ring-2 hover:ring-offset-2 hover:ring-indigo-500"
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
            <Menu.Items className="origin-top-right absolute z-10 right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black dark:ring-gray-600 ring-opacity-5 dark:ring-opacity-100 py-1 focus:outline-none">
              <Menu.Item key="dropdown-logout">
                {({ active }) => (
                  <button
                    className={`${
                      active ? "bg-gray-100 dark:bg-gray-700 text-gray-900 " : "text-gray-500"
                    }
               w-full block py-2 px-4 text-left text-sm leading-5 font-normal dark:text-gray-200`}
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
              <PlusSmIcon
                className="w-4 h-4 fill-current text-indigo-500 dark:text-gray-400"
                aria-hidden="true"
              />
              Draft
            </>
          }
          buttonStyle="bg-indigo-50 dark:bg-gray-800 text-indigo-700 dark:text-gray-200 ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-normal rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:border dark:border-gray-400 dark:hover:bg-gray-700"
        />
      </div>
    )
  } else {
    return (
      <div className="hidden lg:flex lg:items-center lg:justify-end xl:col-span-4">
        <Link href={Routes.LoginPage()}>
          <a className="whitespace-nowrap text-sm leading-5 font-normal text-indigo-700 dark:text-gray-200 bg-indigo-100 hover:bg-indigo-200 dark:bg-gray-800 dark:hover:bg-gray-700 border-0 dark:border dark:border-gray-600 px-4 py-2 rounded">
            Log in
          </a>
        </Link>
        <Link href={Routes.SignupPage()}>
          <a className="ml-2 2xl:ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm leading-5 font-normal text-white bg-indigo-600 hover:bg-indigo-700">
            Create account
          </a>
        </Link>
      </div>
    )
  }
}

export default FullWidthMenu
