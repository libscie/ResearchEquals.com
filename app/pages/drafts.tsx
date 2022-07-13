import { useSession, useQuery, useRouterQuery, Router, useRouter } from "blitz"
import Layout from "app/core/layouts/Layout"
import { Suspense, useEffect, useState } from "react"
import moment from "moment"

import Navbar from "../core/components/Navbar"
import getDrafts from "../core/queries/getDrafts"
import ModuleEdit from "../modules/components/ModuleEdit"
import { useCurrentUser } from "../core/hooks/useCurrentUser"
import ModuleCard from "../core/components/ModuleCard"
import { useMediaPredicate } from "react-media-hook"
import { useCurrentWorkspace } from "app/core/hooks/useCurrentWorkspace"
import generateSignature from "../signature"
import LayoutLoader from "app/core/components/LayoutLoader"
import getInvitedModules from "app/workspaces/queries/getInvitedModules"
import Ripple from "../core/components/Ripple"
import { useRecoilState } from "recoil"
import {
  currentUserAtom,
  currentWorkspaceAtom,
  draftsAtom,
  invitationsAtom,
} from "app/core/utils/Atoms"

export async function getServerSideProps(context) {
  // Expires in 30 minutes
  const expire = Math.round(Date.now() / 1000) + 60 * 30
  const signature = generateSignature(process.env.UPLOADCARE_SECRET_KEY, expire.toString())

  return {
    props: {
      expire,
      signature,
    },
  }
}

const DraftsContents = ({ expire, signature, currentWorkspace, session, user }) => {
  const [currentModule, setModule] = useState<any>(undefined)
  const [inboxOpen, setInboxOpen] = useState(true)
  const [drafts, { refetch: getDraftsAgain }] = useQuery(getDrafts, { session })
  const query = useRouterQuery()
  const biggerWindow = useMediaPredicate("(min-width: 1024px)")

  useEffect(() => {
    if (query.suffix) {
      setModule(drafts.filter((draft) => draft.suffix === query.suffix)[0])
    } else {
      setModule(drafts[0])
    }

    if (drafts.length === 0) {
      setInboxOpen(false)
    }
  }, [])

  return (
    <>
      <div
        className="flex w-screen divide-x divide-gray-100 dark:divide-gray-600"
        style={{
          height: biggerWindow ? "calc(100vh - 73px - 55px)" : "100%",
        }}
      >
        {drafts.length > 0 ? (
          <>
            <div
              className={`${
                !inboxOpen ? "hidden" : "inline"
              } float-left w-full divide-y-0 divide-gray-100 overflow-y-auto dark:divide-gray-600 lg:w-80`}
              // style={{ minHeight: "calc(100vh - 74px - 54px)" }}
            >
              <h1 className="border-b border-gray-100 px-4 py-4 text-lg font-medium leading-7 text-gray-900 dark:border-gray-600 dark:text-gray-200 sm:px-6 lg:hidden lg:border-b-0 lg:px-8">
                Drafts
              </h1>
              <ul role="list" className="divide-y divide-gray-100 dark:divide-gray-600">
                {drafts.map((draft) => (
                  <>
                    <li
                      onClick={() => {
                        setModule(draft)
                        setInboxOpen(biggerWindow)
                        Router.push("/drafts", { query: { suffix: draft.suffix } })
                      }}
                      className="cursor-pointer"
                    >
                      <ModuleCard
                        type={draft.type.name}
                        title={draft.title}
                        status="Draft"
                        time={moment(draft.updatedAt).fromNow()}
                        timeText="Updated"
                        authors={draft.authors}
                      />
                    </li>
                  </>
                ))}
              </ul>
            </div>
            <div
              className={`${
                inboxOpen ? "hidden lg:inline" : "inline"
              } float-right w-2/3 flex-grow overflow-y-auto`}
            >
              {currentModule ? (
                <Suspense
                  fallback={
                    <div className="mx-auto my-auto">
                      <Ripple />
                    </div>
                  }
                >
                  <ModuleEdit
                    user={user}
                    setModule={setModule}
                    fetchDrafts={getDraftsAgain}
                    workspace={currentWorkspace}
                    module={currentModule}
                    isAuthor={true}
                    inboxOpen={inboxOpen}
                    setInboxOpen={setInboxOpen}
                    expire={expire}
                    signature={signature}
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
                  <div className="mx-4">No drafts left. Maybe start a new one?</div>
                </>
              </span>
              <div className="hidden w-1/4 sm:table-cell"></div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

const DraftsPage = ({ expire, signature }) => {
  const [currentUser, setCurrentUser] = useRecoilState(currentUserAtom)
  setCurrentUser(useCurrentUser())
  const [currentWorkspace, setCurrentWorkspace] = useRecoilState(currentWorkspaceAtom)
  setCurrentWorkspace(useCurrentWorkspace())
  const [drafts, setDrafts] = useRecoilState(draftsAtom)
  const [invitations, setInvitations] = useRecoilState(invitationsAtom)

  const session = useSession()
  const [tmpDrafts] = useQuery(getDrafts, { session })
  const [tmpInvitations] = useQuery(getInvitedModules, { session })

  useEffect(() => {
    setDrafts(tmpDrafts)
    setInvitations(tmpInvitations)
  }, [])

  return (
    <>
      <Navbar />
      <main className="relative flex">
        <DraftsContents
          expire={expire}
          signature={signature}
          currentWorkspace={currentWorkspace}
          session={session}
          user={currentUser}
        />
      </main>
    </>
  )
}

DraftsPage.authenticate = true
DraftsPage.getLayout = (page) => (
  <Layout title="R= Drafts">
    <LayoutLoader>{page}</LayoutLoader>
  </Layout>
)

export default DraftsPage
