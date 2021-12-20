import { BlitzPage, useSession, useQuery, useRouterQuery, Router } from "blitz"
import Layout from "app/core/layouts/Layout"
import { Disclosure } from "@headlessui/react"
import { ChevronRightIcon } from "@heroicons/react/solid"
import { Suspense, useState } from "react"
import { ProgressBarRound32 } from "@carbon/icons-react"
import moment from "moment"

import Navbar from "../core/components/Navbar"
import getDrafts from "../core/queries/getDrafts"
import ModuleEdit from "../modules/components/ModuleEdit"
import { useCurrentUser } from "../core/hooks/useCurrentUser"
import ModuleCard from "../core/components/ModuleCard"

const DraftsContents = () => {
  const session = useSession()
  const [currentModule, setModule] = useState<any>(undefined)
  const [drafts] = useQuery(getDrafts, { session })
  const user = useCurrentUser()
  // TODO: Actualy use routerquery for setmodule
  const query = useRouterQuery()

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
                {drafts.map((message, index) => (
                  <>
                    <li
                      key={message.id + index}
                      className={`cursor-pointer hidden sm:block relative focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 ${
                        currentModule === message ? "bg-indigo-300" : "bg-white"
                      }`}
                      onClick={() => {
                        setModule(message)
                        Router.push("/drafts", { query: { suffix: message.suffix } })
                      }}
                    >
                      <ModuleCard
                        type={message.type.name}
                        title={message.title}
                        status="Draft"
                        time={moment(message.updatedAt).fromNow()}
                        authors={message.authors}
                      />
                    </li>
                    <span
                      onClick={() => {
                        setModule(message)
                        Router.push("/drafts", { query: { suffix: message.suffix } })
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
            <div className="max-w-5xl my-16 sm:my-6  mx-auto text-xl">
              <Disclosure.Button className="inline sm:hidden">x</Disclosure.Button>
              {currentModule ? (
                <Suspense
                  fallback={
                    <div className="mx-auto my-auto">
                      <ProgressBarRound32 className="animate-spin text-white dark:text-white" />
                    </div>
                  }
                >
                  <ModuleEdit user={user} module={currentModule} isAuthor={true} />
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

const DraftsPage: BlitzPage = () => {
  return (
    <>
      <Navbar />
      <main className="flex relative">
        <Suspense fallback="Loading...">
          <DraftsContents />
        </Suspense>
      </main>
    </>
  )
}

DraftsPage.authenticate = true
DraftsPage.getLayout = (page) => <Layout title="Drafts">{page}</Layout>

export default DraftsPage
