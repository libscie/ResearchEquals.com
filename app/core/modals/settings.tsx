import { Tab } from "@headlessui/react"
import { useEffect, useRef } from "react"
import { Close } from "@carbon/icons-react"
import { useRecoilState } from "recoil"
import { emailNotificationsAtom, settingsTabAtom } from "../utils/Atoms"

import WorkspaceSettings from "../components/WorkspaceSettings"
import AccountSettings from "../components/AccountSettings"
import EmailSettings from "../components/EmailSettings"

function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

export default function SettingsModal({ button, styling, user, workspace }) {
  let [categories] = useRecoilState(settingsTabAtom)
  const [emailNotifications, setEmailNotifications] = useRecoilState(emailNotificationsAtom)
  let x = user.memberships.map((membership) => {
    return {
      [`${membership.workspace.handle}-invitations`]: membership.emailInvitations,
      [`${membership.workspace.handle}-approvals`]: membership.emailApprovals,
      [`${membership.workspace.handle}-weeklyDigest`]: membership.emailWeeklyDigest,
      [`${membership.workspace.handle}-collections`]: membership.emailCollections,
    }
  })[0]

  useEffect(() => {
    if (JSON.stringify(emailNotifications) === "{}") {
      setEmailNotifications({
        emailConsent: false,
        marketingConsent: false,
        ...x,
      })
    }
  }, [setEmailNotifications, emailNotifications, x])

  const dialogRef = useRef<HTMLDialogElement | null>(null)
  const showModal = (value) => {
    if (value) {
      return dialogRef?.current?.showModal()
    }
    if (!value) {
      return dialogRef?.current?.close()
    }
  }

  return (
    <>
      <button type="button" onClick={() => showModal(true)} className={styling}>
        {button}
      </button>
      <dialog
        ref={dialogRef}
        className="fixed inset-0 z-10 bg-transparent border-gray-300 w-full sm:w-max"
        onMouseDown={(e) => {
          e.target == dialogRef.current && showModal(false)
        }}
      >
        <div
          id="dialog-container"
          className="fixed sm:relative top-0 sm:top-auto w-full inset-0 sm:inset-auto sm:min-w-120 sm:max-w-120
              inline-block min-h-screen rounded border border-gray-300 bg-white text-left align-middle text-gray-900 shadow dark:border-gray-600 dark:bg-gray-900 sm:min-h-full sm:w-auto"
        >
          <Tab.Group>
            <div className="sticky top-0 rounded-t border-b border-gray-300 bg-white text-sm font-normal leading-5 text-gray-900 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200">
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
                          : "hover:bg-gray-100 dark:hover:bg-gray-800",
                      )
                    }
                  >
                    {category}
                  </Tab>
                ))}
                <button className="inline-flex items-center justify-center  rounded-md p-2 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 dark:text-gray-500 dark:hover:text-gray-300">
                  <span className="sr-only">Close menu</span>
                  <Close
                    size={32}
                    className="h-6 w-6"
                    aria-hidden="true"
                    onClick={() => showModal(false)}
                  />
                </button>
              </Tab.List>
            </div>
            <Tab.Panels className="mt-2 mb-0 px-2">
              <Tab.Panel key="workspace-panel">
                <WorkspaceSettings workspace={workspace} setIsOpen={showModal} />
              </Tab.Panel>
              <Tab.Panel key="account-panel">
                <AccountSettings user={user} setIsOpen={showModal} />
              </Tab.Panel>
              <Tab.Panel key="emails-panel">
                <EmailSettings user={user} setIsOpen={showModal} />
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </dialog>
    </>
  )
}
