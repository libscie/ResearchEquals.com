import { Fragment, useState } from "react"
import { Listbox, Transition, Dialog } from "@headlessui/react"
import { Link, Routes, useMutation, useSession, useQuery } from "blitz"
import { Suspense } from "react"
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid"
import { Close32, Menu32 } from "@carbon/icons-react"
import { useCurrentUser } from "../hooks/useCurrentUser"
import { useCurrentWorkspace } from "../hooks/useCurrentWorkspace"
import logout from "../../auth/mutations/logout"
import SettingsModal from "../modals/settings"
import changeSessionWorkspace from "../../workspaces/mutations/changeSessionWorkspace"
import getDrafts from "../queries/getDrafts"

const DropdownContents = () => {
  const currentUser = useCurrentUser()
  const currentWorkspace = useCurrentWorkspace()
  const [logoutMutation] = useMutation(logout)
  const session = useSession()
  const [drafts] = useQuery(getDrafts, { session })

  const [changeSessionWorkspaceMutation] = useMutation(changeSessionWorkspace)
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
      <div className="">
        <div className="">
          <Listbox
            value={selected}
            onChange={async (value) => {
              await changeSessionWorkspaceMutation(value?.workspace.id)
              setSelected(value)
            }}
          >
            <div className="relative">
              <Listbox.Button className="flex py-2 pl-3 pr-10 text-left bg-white rounded-lg shadow-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm">
                <div className="flex-shrink-0">
                  <img
                    className="h-10 w-10 rounded-full"
                    src={selected!.workspace!.avatar!}
                    alt={`Avatar of ${
                      selected!.workspace.name
                        ? selected!.workspace.name
                        : selected!.workspace.handle
                    }`}
                  />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">
                    {selected!.workspace.name}
                  </div>
                  <div className="text-sm font-medium text-gray-500">{currentUser.email}</div>
                </div>
                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <SelectorIcon className="w-5 h-5 text-gray-400" aria-hidden="true" />
                </span>
              </Listbox.Button>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {currentUser.memberships.map((membership, index) => (
                    <Listbox.Option
                      key={index}
                      className={({ active }) =>
                        `${active ? "text-indigo-900 bg-indigo-100" : "text-gray-900"}
                      cursor-default select-none relative py-2 pl-10 pr-4`
                      }
                      value={membership}
                    >
                      {({ selected, active }) => (
                        <>
                          <span
                            className={`${selected ? "font-medium" : "font-normal"} flex truncate`}
                          >
                            <img
                              className="h-7 w-7 rounded-full"
                              src={membership.workspace!.avatar!}
                              alt={`Avatar of ${
                                membership.workspace.name
                                  ? membership.workspace.name
                                  : membership.workspace.handle
                              }`}
                            />
                            <span
                              className={`${
                                selected ? "font-medium" : "font-normal"
                              } block truncate`}
                            >
                              {membership.workspace.handle}
                            </span>
                            {selected ? (
                              <span
                                className={`${active ? "text-amber-600" : "text-amber-600"}
                                absolute inset-y-0 left-0 flex items-center pl-3`}
                              >
                                <CheckIcon className="w-5 h-5" aria-hidden="true" />
                              </span>
                            ) : null}
                          </span>
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
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
          <Link href={Routes.DraftsPage()}>
            <button className="block rounded-md py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900">
              Drafts
              <span className="bg-gray-100 text-gray-900 ml-3 py-0.5 px-2.5 rounded-full text-xs font-medium">
                {drafts.length}
              </span>
            </button>
          </Link>
          <Link href="#">
            <button className="block rounded-md py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900">
              <SettingsModal
                styling="block rounded-md text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900"
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
