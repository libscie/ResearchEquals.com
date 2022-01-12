import { BlitzPage, useSession, useQuery, useRouterQuery, Router, useRouter } from "blitz"
import Layout from "app/core/layouts/Layout"
import { Suspense, useEffect, useState } from "react"
import { ProgressBarRound32 } from "@carbon/icons-react"
import moment from "moment"

import Navbar from "../core/components/Navbar"
import { useCurrentUser } from "../core/hooks/useCurrentUser"
import ModuleCard from "../core/components/ModuleCard"
import getInvitedModules from "app/workspaces/queries/getInvitedModules"
import ModuleInvitation from "../modules/components/ModuleInvitation"
import { useCurrentWorkspace } from "../core/hooks/useCurrentWorkspace"
import { useMediaPredicate } from "react-media-hook"
import LayoutLoader from "app/core/components/LayoutLoader"
import getDrafts from "app/core/queries/getDrafts"

const Invitations = () => {
  const session = useSession()
  const [currentModule, setModule] = useState<any>(undefined)
  const currentWorkspace = useCurrentWorkspace()
  const [inboxOpen, setInboxOpen] = useState(true)
  const biggerWindow = useMediaPredicate("(min-width: 1024px)")
  const [invitations, { refetch }] = useQuery(getInvitedModules, { session })
  const user = useCurrentUser()
  const query = useRouterQuery()

  useEffect(() => {
    if (query.suffix) {
      setModule(invitations.filter((invite) => invite.suffix === query.suffix)[0])
    }

    if (invitations.length === 0) {
      setInboxOpen(false)
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
      {invitations.length > 0 ? (
        <>
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
        </>
      ) : (
        <div className="flex flex-col flex-grow relative w-full border-2 border-gray-100 border-dashed rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500  my-4 mx-4">
          <div className="table flex-grow w-full h-full">
            <div className="sm:table-cell w-1/4 h-28"></div>
            <span className="mx-auto table-cell align-middle text-sm leading-4 font-medium">
              <>
                <div>No invitations left. Maybe start your own module?</div>
              </>
            </span>
            <div className="hidden sm:table-cell w-1/4"></div>
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
  const [drafts] = useQuery(getDrafts, { session })
  const [invitations] = useQuery(getInvitedModules, { session })

  return (
    <>
      <Navbar
        currentUser={currentUser}
        session={session}
        currentWorkspace={currentWorkspace}
        router={router}
        drafts={drafts}
        invitations={invitations}
      />
      <main className="flex relative">
        <Invitations />
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
