import { Router, useRouter } from "next/router"
import { useQuery } from "@blitzjs/rpc"
import { useSession } from "@blitzjs/auth"
import { BlitzPage } from "@blitzjs/next"
import Layout from "app/core/layouts/Layout"
import { Suspense, useEffect, useState } from "react"
import { ProgressBarRound } from "@carbon/icons-react"
import moment from "moment"

import Navbar from "app/core/components/Navbar"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import ModuleCard from "app/core/components/ModuleCard"
import getInvitedModules from "app/workspaces/queries/getInvitedModules"
import ModuleInvitation from "app/modules/components/ModuleInvitation"
import { useCurrentWorkspace } from "app/core/hooks/useCurrentWorkspace"
import { useMediaPredicate } from "react-media-hook"
import LayoutLoader from "app/core/components/LayoutLoader"
import getDrafts from "app/core/queries/getDrafts"

const Invitations = ({ currentWorkspace }) => {
  const session = useSession()
  const [currentModule, setModule] = useState<any>(undefined)
  const [inboxOpen, setInboxOpen] = useState(true)
  const biggerWindow = useMediaPredicate("(min-width: 1024px)")
  const [invitations, { refetch }] = useQuery(getInvitedModules, { session })
  const user = useCurrentUser()
  const router = useRouter()
  const query = router.query

  useEffect(() => {
    if (query.suffix) {
      setModule(invitations.filter((invite) => invite.suffix === query.suffix)[0])
    } else {
      setModule(invitations[0])
    }

    if (invitations.length === 0) {
      setInboxOpen(false)
    }
  }, [])

  return (
    <div
      className="flex w-screen divide-x divide-gray-100 dark:divide-gray-600"
      style={{
        height: biggerWindow ? "calc(100vh - 73px - 55px)" : "100%",
      }}
    >
      {invitations.length > 0 ? (
        <>
          <div
            className={`${
              !inboxOpen ? "hidden" : "inline"
            } float-left w-full divide-y-0 divide-gray-100 overflow-y-auto dark:divide-gray-600 lg:w-80`}
          >
            <h1 className="border-b border-gray-100 px-4 py-4 text-lg font-medium leading-7 text-gray-900 dark:border-gray-600 dark:text-gray-200 sm:px-6 lg:hidden lg:border-b-0 lg:px-8">
              Invitations
            </h1>
            <ul role="list" className="divide-y divide-gray-100 dark:divide-gray-600">
              {invitations.map((draft) => (
                <li
                  key={draft.id}
                  onClick={async () => {
                    setModule(draft)
                    setInboxOpen(biggerWindow)
                    await router.push("/invitations", { query: { suffix: draft.suffix } })
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
              ))}
            </ul>
          </div>
          <div className={`${inboxOpen ? "hidden lg:inline" : "inline"} w-2/3 flex-grow`}>
            {currentModule ? (
              <Suspense
                fallback={
                  <div className="mx-auto my-auto">
                    <ProgressBarRound
                      size={32}
                      className="animate-spin text-white dark:text-white"
                    />
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
        </>
      ) : (
        <div className="relative my-4 mx-4 flex w-full flex-grow flex-col rounded-lg border-2 border-dashed border-gray-800 text-center focus:outline-none focus:ring-2 focus:ring-indigo-500  focus:ring-offset-2 dark:border-white">
          <div className="table h-full w-full flex-grow">
            <div className="h-28 w-1/4 sm:table-cell"></div>
            <span className="mx-auto table-cell align-middle text-sm font-medium leading-4">
              <>
                <div className="mx-4">
                  No co-author invitations received. Maybe start your own module?
                </div>
              </>
            </span>
            <div className="hidden w-1/4 sm:table-cell"></div>
          </div>
        </div>
      )}
    </div>
  )
}

const InvitationsPage: BlitzPage = () => {
  const currentUser = useCurrentUser()
  const session = useSession()
  const currentWorkspace = useCurrentWorkspace()
  const router = useRouter()
  const [drafts, { refetch }] = useQuery(getDrafts, { session })
  const [invitations] = useQuery(getInvitedModules, { session })

  return (
    <>
        <Navbar />

      <main className="relative flex">
        <Invitations currentWorkspace={currentWorkspace} />
      </main>
    </>
  )
}

InvitationsPage.authenticate = true
InvitationsPage.getLayout = (page) => (
  <Layout title="R= Invitations">
    <LayoutLoader>{page}</LayoutLoader>
  </Layout>
)

export default InvitationsPage
