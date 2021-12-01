import { BlitzPage, useSession, useQuery, useRouterQuery, Router, useMutation } from "blitz"
import Layout from "app/core/layouts/Layout"
import { Disclosure } from "@headlessui/react"
import { ChevronRightIcon } from "@heroicons/react/solid"
import { Suspense, useState } from "react"
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

const Invitations = () => {
  const session = useSession()
  const [currentModule, setModule] = useState<any>(undefined)
  const currentWorkspace = useCurrentWorkspace()
  const [invitations, { refetch }] = useQuery(getInvitedModules, { session })
  const user = useCurrentUser()
  // TODO: Actualy use routerquery for setmodule
  const query = useRouterQuery()
  const [acceptMutation] = useMutation(acceptInvitation)
  const [declineMutation] = useMutation(removeInvitation)
  // todo: uses author ID and suffix
  // requires us to match the current workspace to the author id for this module
  // find author id in invitations by filtering for workspace id

  return (
    <Disclosure defaultOpen={true}>
      {({ open }) => (
        <>
          <Disclosure.Panel
            className="float-left w-full sm:border-r border-gray-700 sm:w-1/4 bg-gray-300 text-2xl text-gray-500 overflow-y-auto"
            style={{
              height: "calc(100vh - 78.233333px)",
              float: "left",
            }}
          >
            <Suspense fallback="Loading...">
              <ul role="list" className="divide-y divide-gray-200">
                {invitations.map((message, index) => (
                  <>
                    <li
                      key={message.id + index}
                      className={`cursor-pointer hidden sm:block relative focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 ${
                        currentModule === message ? "bg-indigo-300" : "bg-white"
                      }`}
                      onClick={() => {
                        setModule(message)
                        Router.push("/invitations", { query: { suffix: message.suffix } })
                      }}
                    >
                      <ModuleCard
                        type={message.type.name}
                        title={message.title}
                        status="Invitation"
                        time={moment(message.updatedAt).fromNow()}
                        authors={message.authors}
                      />
                    </li>
                    <span
                      onClick={() => {
                        setModule(message)
                        Router.push("/invitations", { query: { suffix: message.suffix } })
                      }}
                    >
                      <Disclosure.Button
                        as="li"
                        key={message.id + "-disclosure" + index}
                        className={`sm:hidden relative focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 ${
                          currentModule === message ? "bg-indigo-300" : "bg-white"
                        }`}
                      >
                        <ModuleCard
                          type={message.type.name}
                          title={message.title}
                          status="Draft"
                          time={moment(message.updatedAt).fromNow()}
                          authors={message.authors}
                        />
                      </Disclosure.Button>
                    </span>
                  </>
                ))}
              </ul>
            </Suspense>
          </Disclosure.Panel>
          <Disclosure.Button className="hidden sm:inline inherit top-0 left-0 justify-between px-1 py-2 text-sm font-medium text-left text-gray-900 bg-gray-300 hover:bg-gray-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
            <ChevronRightIcon
              className={`${open ? "transform rotate-180" : ""} w-5 h-5 text-purple-500 `}
            />
          </Disclosure.Button>
          <div
            className={`${
              open ? "bg-gray-300 hidden" : "bg-gray-300"
            } float-right  sm:inline overflow-y-auto`}
            style={{
              top: 0,
              width: "100%",
              height: "calc(100vh - 78.233333px)",
            }}
          >
            {/* TODO: Add invitation accept/decline */}
            {currentModule ? (
              <div className="w-full sm:flex p-2 bg-gray-400">
                <div className="flex-grow text-middle align-middle">
                  <span className="inline-block h-full align-middle text-sm leading-4"></span>
                  You are invited to co-author this module. Do you accept the invitation?
                </div>
                <div>
                  <button
                    className="m-2 sm:my-0 py-2 px-4 border border-gray-500 bg-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={async () => {
                      await acceptMutation({
                        id: currentModule.authors.filter(
                          (author) => author.workspaceId === currentWorkspace!.id
                        )[0].id,
                        suffix: currentModule.suffix,
                      })
                      refetch()
                      // TODO: Move to next invitation on the list
                      setModule(undefined)

                      toast.success("Accepted invitation")
                    }}
                  >
                    Accept
                  </button>
                  <button
                    className="mx-2 py-2 px-4 border border-gray-500 bg-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={async () => {
                      await declineMutation({
                        id: currentModule.authors.filter(
                          (author) => author.workspaceId === currentWorkspace!.id
                        )[0].id,
                        suffix: currentModule.suffix,
                      })
                      refetch()
                      setModule(undefined)

                      toast("Declined invitation", { icon: "👋" })
                    }}
                  >
                    Decline
                  </button>
                </div>
              </div>
            ) : (
              ""
            )}
            <div className="max-w-5xl my-16 sm:my-6  mx-auto text-xl">
              <Disclosure.Button className="inline sm:hidden">x</Disclosure.Button>
              {currentModule ? (
                <Suspense
                  fallback={
                    <div className="mx-auto my-auto">
                      <ProgressBarRound32 className="animate-spin" />
                    </div>
                  }
                >
                  <ModuleInvitation user={user} module={currentModule} isAuthor={true} />
                </Suspense>
              ) : (
                ""
              )}
            </div>
          </div>
        </>
      )}
    </Disclosure>
  )
}

const InvitationsPage: BlitzPage = () => {
  return (
    <>
      <Toaster position="bottom-center" reverseOrder={false} />
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
