import { Fragment, useState } from "react"
import { Transition, Dialog } from "@headlessui/react"
import { Link, Routes, useMutation } from "blitz"
import { Suspense } from "react"
import { Close32, Menu32 } from "@carbon/icons-react"
import { useCurrentUser } from "../hooks/useCurrentUser"
import { useCurrentWorkspace } from "../hooks/useCurrentWorkspace"
import logout from "../../auth/mutations/logout"
import SettingsModal from "../modals/settings"

const DropdownContents = () => {
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

const NavbarDropdown = () => {
  let [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <span className="sr-only">Open menu</span>
      {isOpen ? (
        <Close32
          className="block h-6 w-6 text-gray-400"
          onClick={() => {
            setIsOpen(false)
          }}
        />
      ) : (
        <Menu32
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
                          <Close32
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
                      <DropdownContents />
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

export default NavbarDropdown
