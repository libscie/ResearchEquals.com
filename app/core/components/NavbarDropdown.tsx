import { Fragment, useState } from "react"
import { Transition, Dialog } from "@headlessui/react"
import { Link, Routes, useMutation } from "blitz"
import { Add32, Close32, Menu32 } from "@carbon/icons-react"
import logout from "../../auth/mutations/logout"
import SettingsModal from "../modals/settings"
import ResearchEqualsLogo from "./ResearchEqualsLogo"
import QuickDraft from "../../modules/components/QuickDraft"
import DropdownNotificationModal from "../modals/DropdownNotificationModal"

const DropdownContents = ({ currentUser, currentWorkspace, router, invitedModules, drafts }) => {
  const [logoutMutation] = useMutation(logout)

  if (currentUser && currentWorkspace) {
    return (
      <>
        <div className="mt-3 pt-0 pb-2 px-4 space-y-1 border-b border-gray-200 dark:border-gray-600">
          <QuickDraft
            buttonText={
              <>
                <Add32
                  className="inline w-4 h-4 fill-current text-indigo-500 dark:text-gray-400"
                  aria-hidden="true"
                />
                Quick Draft
              </>
            }
            buttonStyle="w-full py-2 bg-indigo-50 dark:bg-gray-800 text-indigo-700 dark:text-gray-200  border border-transparent text-sm leading-5 font-normal rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:border dark:border-gray-400 dark:hover:bg-gray-700"
          />
          <Link href={Routes.Dashboard()}>
            <button className="group w-full text-left block rounded-md px-2 py-2 text-gray-900 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 text-base leading-5 font-normal">
              Dashboard
            </button>
          </Link>
          <Link href={Routes.HandlePage({ handle: currentWorkspace.handle })}>
            <button className="group w-full text-left block rounded-md px-2 py-2 text-gray-900 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 text-base leading-5 font-normal">
              Profile
            </button>
          </Link>
          <Link href={Routes.DraftsPage()}>
            <button className="group w-full text-left block rounded-md px-2 py-2 text-gray-900 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 text-base leading-5 font-normal">
              Drafts
              <span className="bg-white dark:bg-gray-900 border border-gray-300 shadow-sm group-hover:bg-indigo-100 group-hover:text-indigo-800 dark:border-gray-600 dark:group-hover:bg-gray-700 text-gray-900 dark:text-gray-200 ml-3 py-0.5 px-2.5 rounded-full text-xs font-medium">
                {drafts.length}
              </span>
            </button>
          </Link>
          <Link href={Routes.InvitationsPage()}>
            <button className="group w-full text-left block rounded-md px-2 py-2 text-gray-900 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 text-base leading-5 font-normal">
              Invitations
              <span className="bg-white dark:bg-gray-900 border border-gray-300 shadow-sm group-hover:bg-indigo-100 group-hover:text-indigo-800 dark:border-gray-600 dark:group-hover:bg-gray-700 text-gray-900 dark:text-gray-200 ml-3 py-0.5 px-2.5 rounded-full text-xs font-medium">
                {invitedModules.length}
              </span>
            </button>
          </Link>
        </div>
        <div className="mt-3 pt-0 pb-2 px-4 space-y-1">
          <li className="py-2 px-2 flex">
            <div className="mr-2">
              <img
                src={currentWorkspace!.avatar!}
                alt={`Avatar of ${currentWorkspace.handle}`}
                className="w-10 h-10 rounded-full inline-block h-full align-middle"
              />
            </div>
            <div className="flex-grow">
              <span className="inline-block h-full align-middle"></span>
              <p className="text-gray-700 dark:text-gray-200 text-sm leading-4 font-normal my-auto inline-block align-middle">
                {currentWorkspace.firstName} {currentWorkspace.lastName}
                <p className="text-gray-500 dark:text-gray-400 text-xs leading-4 font-normal">
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
            className="w-full text-left block rounded-md px-2 py-2 text-gray-500 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 text-base leading-5 font-normal"
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
            <button className="w-full block rounded-md py-2 px-0 text-sm leading-5 font-normal text-indigo-700 dark:text-gray-200 bg-indigo-100 hover:bg-indigo-200 dark:bg-gray-800 dark:hover:bg-gray-700 border-0 dark:border dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Log in
            </button>
          </Link>
          <Link href={Routes.SignupPage()}>
            <button className="w-full my-1 block rounded-md py-2 px-0 text-sm leading-5 font-normal text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Create account
            </button>
          </Link>
        </div>
      </>
    )
  }
}

const NavbarDropdown = ({ currentUser, currentWorkspace, router, invitedModules, drafts }) => {
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
            className="rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:text-gray-200 dark:hover:text-white dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            onClick={() => {
              setIsOpen(true)
            }}
          >
            <span className="sr-only">Open menu</span>
            <Menu32 className="block h-6 w-6 text-gray-400 dark:text-gray-200 hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-800 rounded-md focus:ring-2 focus:ring-offset-0 focus:ring-gray-200" />
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
              <div className="inline-block w-full my-0 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-900 shadow-xl border-b dark:border-gray-600">
                <Dialog.Title as="h1" className="text-lg font-medium leading-6 text-gray-900 m-5">
                  <div className="pt-0 pb-0 px-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <ResearchEqualsLogo />
                      </div>
                      <div className="-mr-2">
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
                  </div>
                </Dialog.Title>
                <div className="items-center justify-between">
                  <DropdownContents
                    currentUser={currentUser}
                    currentWorkspace={currentWorkspace}
                    router={router}
                    invitedModules={invitedModules}
                    drafts={drafts}
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
