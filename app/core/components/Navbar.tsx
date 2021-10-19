/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useState } from "react"
import { Menu, Popover, Transition, Dialog } from "@headlessui/react"
import { BellIcon, MenuIcon, XIcon } from "@heroicons/react/outline"
import { ChevronDownIcon, SearchIcon } from "@heroicons/react/solid"
import { Link, Routes, useMutation, Image } from "blitz"
import { Suspense } from "react"
import {
  Notification32,
  LocationPersonFilled32,
  ProgressBarRound32,
  Settings32,
  OverflowMenuHorizontal32,
} from "@carbon/icons-react"

import { useCurrentUser } from "../hooks/useCurrentUser"
import logout from "../../auth/mutations/logout"
import { useCurrentWorkspace } from "../hooks/useCurrentWorkspace"
import Autocomplete from "./Autocomplete"
import SettingsModal from "../modals/settings"

function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

export default function Example() {
  return (
    <>
      <div className="w-full bg-gray-700 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex justify-between xl:grid xl:grid-cols-12 lg:gap-8">
          <div className="flex md:absolute md:left-0 md:inset-y-0 lg:static xl:col-span-2">
            <div className="flex-shrink-0 flex items-center">
              {/* TODO: Replace w logo */}
              <Link href={Routes.Home()}>
                <a>
                  <img
                    className="block h-8 w-auto"
                    src="https://tailwindui.com/img/logos/workflow-mark.svg?color=indigo&shade=600"
                    alt="Workflow"
                  />
                </a>
              </Link>
            </div>
          </div>
          <div className="min-w-0 flex-1 md:px-8 lg:px-0 xl:col-span-6">
            <div className="flex items-center px-6 py-4 md:max-w-3xl md:mx-auto lg:max-w-none lg:mx-0 xl:px-0">
              <div className="w-full">
                <label htmlFor="search" className="sr-only">
                  Search
                </label>
                <Autocomplete className="h-full" />
              </div>
            </div>
          </div>
          <div className="flex items-center md:absolute md:right-0 md:inset-y-0 lg:hidden">
            <DropdownDialog />
          </div>
          {/* TODO: Make sure the loading state shows up on the right and vertically centered */}
          <Suspense fallback={<div className="bg-red-400">Loading...</div>}>
            <FullWidthMenu />
          </Suspense>
        </div>
      </div>
    </>
  )
}

const FullWidthMenu = () => {
  const currentUser = useCurrentUser()
  const currentWorkspace = useCurrentWorkspace()
  const [logoutMutation] = useMutation(logout)

  if (currentUser && currentWorkspace) {
    return (
      <div className="hidden lg:flex lg:items-center lg:justify-end xl:col-span-4">
        {/* TODO: Workspace switcher */}
        <img
          className="h-8 w-8 rounded-full"
          src={currentWorkspace.avatar}
          alt={`Avatar of ${
            currentWorkspace.name ? currentWorkspace.name : currentWorkspace.handle
          }`}
        />
        <a
          href="#"
          className="ml-5 flex-shrink-0 p-1 text-gray-400 hover:text-gray-500 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <span className="sr-only">View notifications</span>
          <BellIcon className="h-6 w-6" aria-hidden="true" />
        </a>
        <span className="sr-only">Open settings</span>
        <SettingsModal
          button={
            <Settings32
              className="h-6 w-6 text-gray-400 hover:text-gray-500 rounded-full flex focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              aria-hidden="true"
            />
          }
          user={currentUser}
          workspace={currentWorkspace}
        />
        <Menu as="div" className="flex-shrink-0 relative ml-5">
          <div>
            <Menu.Button className="rounded-full flex focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <span className="sr-only">Open user menu</span>
              <OverflowMenuHorizontal32
                className="h-6 w-6 text-gray-400 hover:text-gray-500 "
                aria-hidden="true"
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
            {/* TODO: Add keyboard navigation */}
            <Menu.Items className="origin-top-right absolute z-10 right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1 focus:outline-none">
              <Menu.Item key="dropdown-dashboard">
                <Link href={Routes.Dashboard()}>
                  <button className="w-full block py-2 px-4 text-left text-sm text-gray-700 hover:bg-gray-100">
                    Dashboard
                  </button>
                </Link>
              </Menu.Item>
              <Menu.Item key="dropdown-profile">
                <Link href={Routes.HandlePage({ handle: currentWorkspace.handle })}>
                  <button className="w-full block py-2 px-4 text-left text-sm text-gray-700 hover:bg-gray-100">
                    Profile
                  </button>
                </Link>
              </Menu.Item>
              <Menu.Item key="dropdown-logout">
                <button
                  className="w-full block py-2 px-4 text-left text-sm text-gray-700 hover:bg-gray-100"
                  onClick={async () => {
                    await logoutMutation()
                  }}
                >
                  Logout
                </button>
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
        {/* TODO: Add action */}
        <a
          href="#"
          className="ml-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Create module
        </a>
      </div>
    )
  } else {
    return (
      <div className="hidden lg:flex lg:items-center lg:justify-end xl:col-span-4">
        <Link href={Routes.LoginPage()}>
          <a className="whitespace-nowrap text-base hover:text-gray-300 border-2 border-indigo-600 px-4 py-2 text-white rounded">
            Log in
          </a>
        </Link>
        <Link href={Routes.SignupPage()}>
          <a className="ml-4 2xl:ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base text-white bg-indigo-600 hover:bg-indigo-700">
            Create account
          </a>
        </Link>
      </div>
    )
  }
}

const DropdownDialogContents = () => {
  const currentUser = useCurrentUser()
  const currentWorkspace = useCurrentWorkspace()
  const [logoutMutation] = useMutation(logout)

  if (currentUser && currentWorkspace) {
    return (
      <div>
        <div className="max-w-3xl mx-auto px-0 flex items-center">
          <div className="flex-shrink-0">
            <img
              className="h-10 w-10 rounded-full"
              src={currentWorkspace.avatar}
              alt={`Avatar of ${
                currentWorkspace.name ? currentWorkspace.name : currentWorkspace.handle
              }`}
            />
          </div>
          <div className="ml-3">
            <div className="text-base font-medium text-gray-800">{currentWorkspace.name}</div>
            <div className="text-sm font-medium text-gray-500">{currentUser.email}</div>
          </div>
          {/* <button
            type="button"
            className="ml-auto flex-shrink-0 bg-white rounded-full p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <span className="sr-only">View notifications</span>
            <BellIcon className="h-6 w-6" aria-hidden="true" />
          </button> */}
        </div>
        <div className="mt-3 max-w-3xl mx-auto px-0 space-y-1">
          <Link href={Routes.Dashboard()}>
            <button className="block rounded-md py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900">
              Dashboard
            </button>
          </Link>
          <Link href={Routes.HandlePage({ handle: currentWorkspace.handle })}>
            <button className="block rounded-md py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900">
              Profile
            </button>
          </Link>
          <Link href="">
            <button className="block rounded-md py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900">
              <SettingsModal
                button={
                  <button className="block rounded-md text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900">
                    Settings
                  </button>
                }
                user={currentUser}
                workspace={currentWorkspace}
              />
            </button>
          </Link>
          <button
            className="block rounded-md py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            onClick={async () => {
              await logoutMutation()
            }}
          >
            Logout
          </button>
        </div>
      </div>
    )
  } else {
    return (
      <div>
        <div>
          <Link href={Routes.LoginPage()}>
            <button className="block rounded-md py-2 px-0 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900">
              Log in
            </button>
          </Link>
          <Link href={Routes.SignupPage()}>
            <button className="block rounded-md py-2 px-0 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900">
              Create account
            </button>
          </Link>
        </div>
      </div>
    )
  }
}

const DropdownDialog = () => {
  let [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <span className="sr-only">Open menu</span>
      {isOpen ? (
        <XIcon
          className="block h-6 w-6 text-gray-400"
          onClick={() => {
            setIsOpen(false)
          }}
        />
      ) : (
        <MenuIcon
          className="block h-6 w-6 text-gray-400"
          onClick={() => {
            setIsOpen(true)
          }}
        />
      )}

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
              <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
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
              <div className="inline-block w-full p-5 my-0 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl">
                <Dialog.Title as="h1" className="text-lg font-medium leading-6 text-gray-900">
                  <div className="pt-0 pb-6 px-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <img
                          className="block h-8 w-auto"
                          src="https://tailwindui.com/img/logos/workflow-mark.svg?color=indigo&shade=600"
                          alt="Workflow"
                        />
                      </div>
                      <div className="-mr-2">
                        <button className="rounded-md p-2 inline-flex items-center justify-center text-gray-500 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                          <span className="sr-only">Close menu</span>
                          <XIcon
                            className="h-6 w-6"
                            aria-hidden="true"
                            onClick={() => {
                              setIsOpen(false)
                            }}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </Dialog.Title>
                <div className="pt-5 pb-6 px-0">
                  <div className="flex items-center justify-between">
                    <Suspense fallback="Loading...">
                      <DropdownDialogContents />
                    </Suspense>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
