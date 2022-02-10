import { Fragment, useState } from "react"
import { Transition, Dialog } from "@headlessui/react"
import { Link, Routes, useMutation } from "blitz"
import { Add32, Close32, Menu32 } from "@carbon/icons-react"
import logout from "../../auth/mutations/logout"
import SettingsModal from "../modals/settings"
import ResearchEqualsLogo from "./ResearchEqualsLogo"
import QuickDraft from "../../modules/components/QuickDraft"
import DropdownNotificationModal from "../modals/DropdownNotificationModal"

const DropdownContents = ({
  currentUser,
  currentWorkspace,
  router,
  invitedModules,
  drafts,
  refetchFn,
}) => {
  const [logoutMutation] = useMutation(logout)

  if (currentUser && currentWorkspace) {
    return (
      <>
        <div className="mt-3 space-y-1 border-b border-gray-200 px-4 pt-0 pb-2 dark:border-gray-600">
          <QuickDraft
            buttonText={
              <>
                <Add32
                  className="inline h-4 w-4 fill-current text-indigo-500 dark:text-gray-400"
                  aria-hidden="true"
                />
                Quick Draft
              </>
            }
            buttonStyle="w-full py-2 bg-indigo-50 dark:bg-gray-800 text-indigo-700 dark:text-gray-200  border border-transparent text-sm leading-5 font-normal rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:border dark:border-gray-400 dark:hover:bg-gray-700"
            refetchFn={refetchFn}
          />
          <Link href={Routes.Dashboard()}>
            <button className="group block w-full rounded-md px-2 py-2 text-left text-base font-normal leading-5 text-gray-900 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800">
              Dashboard
            </button>
          </Link>

          <Link href={Routes.DraftsPage()}>
            <button className="group block w-full rounded-md px-2 py-2 text-left text-base font-normal leading-5 text-gray-900 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800">
              Drafts
              <span className="ml-3 inline-block rounded-full bg-gray-100 py-0.5 px-2.5 text-xs font-medium text-gray-800 group-hover:bg-indigo-100 group-hover:text-indigo-800 dark:border dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:group-hover:bg-gray-700 dark:group-hover:text-gray-200">
                {drafts.length}
              </span>
            </button>
          </Link>
          <Link href={Routes.InvitationsPage()}>
            <button className="group block w-full rounded-md px-2 py-2 text-left text-base font-normal leading-5 text-gray-900 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800">
              Invitations
              <span className="ml-3 inline-block rounded-full bg-gray-100 py-0.5 px-2.5 text-xs font-medium text-gray-800 group-hover:bg-indigo-100 group-hover:text-indigo-800 dark:border dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:group-hover:bg-gray-700 dark:group-hover:text-gray-200">
                {invitedModules.length}
              </span>
            </button>
          </Link>
          <Link href={Routes.HandlePage({ handle: currentWorkspace.handle })}>
            <button className="group block w-full rounded-md px-2 py-2 text-left text-base font-normal leading-5 text-gray-900 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800">
              Modules
            </button>
          </Link>
        </div>
        <div className="mt-3 space-y-1 px-4 pt-0 pb-2">
          <li className="flex py-2 px-2">
            <div className="mr-2">
              <img
                src={currentWorkspace!.avatar!}
                alt={`Avatar of ${currentWorkspace.handle}`}
                className="inline-block h-10 h-full w-10 rounded-full align-middle"
              />
            </div>
            <div className="flex-grow">
              <span className="inline-block h-full align-middle"></span>
              <p className="my-auto inline-block align-middle text-sm font-normal leading-4 text-gray-700 dark:text-gray-200">
                {currentWorkspace.firstName} {currentWorkspace.lastName}
                <p className="text-xs font-normal leading-4 text-gray-500 dark:text-gray-400">
                  @{currentWorkspace.handle}
                </p>
              </p>
            </div>
            <DropdownNotificationModal invitedModules={invitedModules} />
          </li>
          <Link href="#">
            <SettingsModal
              styling="w-full text-left block rounded-md px-2 py-2 text-gray-500 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 text-base leading-5 font-normal"
              button="Settings"
              user={currentUser}
              workspace={currentWorkspace}
            />
          </Link>
          <button
            className="block w-full rounded-md px-2 py-2 text-left text-base font-normal leading-5 text-gray-500 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700"
            onClick={async () => {
              router.push("/")
              await logoutMutation()
            }}
          >
            Log out
          </button>
        </div>
      </>
    )
  } else {
    return (
      <>
        <div className="px-5 pb-2">
          <Link href={Routes.LoginPage()}>
            <button className="block w-full rounded-md border-0 bg-indigo-100 py-2 px-0 text-sm font-normal leading-5 text-indigo-700 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700">
              Log in
            </button>
          </Link>
          <Link href={Routes.SignupPage()}>
            <button className="my-1 block w-full rounded-md bg-indigo-600 py-2 px-0 text-sm font-normal leading-5 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
              Create account
            </button>
          </Link>
        </div>
      </>
    )
  }
}

const NavbarDropdown = ({
  currentUser,
  currentWorkspace,
  router,
  invitedModules,
  drafts,
  refetchFn,
}) => {
  let [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {isOpen ? (
        <>
          <span className="sr-only">Close menu</span>
          <Close32
            className="block h-6 w-6 text-gray-400"
            onClick={() => {
              setIsOpen(false)
            }}
          />
        </>
      ) : (
        <>
          <button
            className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:text-white"
            onClick={() => {
              setIsOpen(true)
            }}
          >
            <span className="sr-only">Open menu</span>
            <Menu32 className="block h-6 w-6 rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:ring-2 focus:ring-gray-200 focus:ring-offset-0 dark:text-gray-200 dark:hover:bg-gray-800" />
          </button>
        </>
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
              <div className="my-0 inline-block w-full transform overflow-hidden border-b bg-white text-left align-middle shadow-xl transition-all dark:border-gray-600 dark:bg-gray-900">
                <Dialog.Title as="h1" className="m-5 text-lg font-medium leading-6 text-gray-900">
                  <div className="px-0 pt-0 pb-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <ResearchEqualsLogo />
                      </div>
                      <div className="-mr-2">
                        <button
                          className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:text-white"
                          onClick={() => {
                            setIsOpen(false)
                          }}
                        >
                          <span className="sr-only">Close menu</span>
                          <Close32 className="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>
                </Dialog.Title>
                <div className="items-center justify-between">
                  <DropdownContents
                    currentUser={currentUser}
                    currentWorkspace={currentWorkspace}
                    router={router}
                    invitedModules={invitedModules}
                    drafts={drafts}
                    refetchFn={refetchFn}
                  />
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
