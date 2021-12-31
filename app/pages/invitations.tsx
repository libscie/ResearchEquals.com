import { BlitzPage, useSession, useQuery, useRouterQuery, Router, useMutation } from "blitz"
import Layout from "app/core/layouts/Layout"
import { Disclosure } from "@headlessui/react"
import { ChevronRightIcon } from "@heroicons/react/solid"
import { Suspense, useEffect, useState } from "react"
import { ProgressBarRound32 } from "@carbon/icons-react"
import moment from "moment"
import toast, { Toaster } from "react-hot-toast"

import Navbar from "../core/components/Navbar"
import { useCurrentUser } from "../core/hooks/useCurrentUser"
import ModuleCard from "../core/components/ModuleCard"
import getInvitedModules from "app/workspaces/queries/getInvitedModules"
import ModuleInvitation from "../modules/components/ModuleInvitation"
import acceptInvitation from "../authorship/mutations/acceptInvitation"
import removeInvitation from "../authorship/mutations/removeInvitation"
import { useCurrentWorkspace } from "../core/hooks/useCurrentWorkspace"
import { useMediaPredicate } from "react-media-hook"

const Invitations = () => {
  const session = useSession()
  const [currentModule, setModule] = useState<any>(undefined)
  const currentWorkspace = useCurrentWorkspace()
  const [inboxOpen, setInboxOpen] = useState(true)
  const biggerWindow = useMediaPredicate("(min-width: 1024px)")

  const [invitations, { refetch }] = useQuery(getInvitedModules, { session })
  const user = useCurrentUser()
  // TODO: Actualy use routerquery for setmodule
  const query = useRouterQuery()
  const [acceptMutation] = useMutation(acceptInvitation)
  const [declineMutation] = useMutation(removeInvitation)
  // todo: uses author ID and suffix
  // requires us to match the current workspace to the author id for this module
  // find author id in invitations by filtering for workspace id

  useEffect(() => {
    if (query.suffix) {
      setModule(invitations.filter((invite) => invite.suffix === query.suffix)[0])
    }
  }, [])

  return (
    <div className="w-screen flex divide-x divide-gray-100 dark:divide-gray-600">
      <div
        className={`${
          !inboxOpen ? "hidden" : "inline"
        } w-full lg:w-80 divide-y-0 divide-gray-100 dark:divide-gray-600`}
        style={{ minHeight: "calc(100vh - 74px - 54px)" }}
      >
        <h1 className="lg:hidden text-lg leading-7 font-medium text-gray-900 dark:text-gray-200 px-4 sm:px-6 lg:px-8 py-4 border-b lg:border-b-0 border-gray-100 dark:border-gray-600">
          Invitations
        </h1>
        <ul role="list" className="divide-y divide-gray-100 dark:divide-gray-600">
          {invitations.map((draft) => (
            <>
              <li
                onClick={() => {
                  setModule(draft)
                  setInboxOpen(biggerWindow)
                  Router.push("/invitations", { query: { suffix: draft.suffix } })
                }}
                className="cursor-pointer"
              >
                <ModuleCard
                  type={draft.type.name}
                  title={draft.title}
                  status="Invitation"
                  time={moment(draft.updatedAt).fromNow()}
                  timeText="Updated"
                  authors={draft.authors}
                />
              </li>
            </>
          ))}
        </ul>
      </div>
      <div className={`${inboxOpen ? "hidden lg:inline" : "inline"} flex-grow w-2/3`}>
        {currentModule ? (
          <Suspense
            fallback={
              <div className="mx-auto my-auto">
                <ProgressBarRound32 className="animate-spin text-white dark:text-white" />
              </div>
            }
          >
            <ModuleInvitation
              user={user}
              module={currentModule}
              setModule={setModule}
              workspace={currentWorkspace}
              isAuthor={true}
              inboxOpen={inboxOpen}
              setInboxOpen={setInboxOpen}
            />
          </Suspense>
        ) : (
          ""
        )}
      </div>
    </div>
  )
}

const InvitationsPage: BlitzPage = () => {
  return (
    <>
      <Navbar />
      <main className="flex relative">
        <Suspense fallback="Loading...">
          <Invitations />
        </Suspense>
      </main>
    </>
  )
}

InvitationsPage.authenticate = true
InvitationsPage.getLayout = (page) => <Layout title="Invitations">{page}</Layout>

export default InvitationsPage
