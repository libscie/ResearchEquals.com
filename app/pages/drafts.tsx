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

const DraftsContents = () => {
  const session = useSession()
  const [currentModule, setModule] = useState<any>(undefined)
  const [drafts] = useQuery(getDrafts, { session })
  const user = useCurrentUser()
  const query = useRouterQuery()

  return (
    <Disclosure defaultOpen={true}>
      {({ open }) => (
        <>
          <Disclosure.Panel
            className="float-left w-full sm:w-64 bg-gray-300 text-2xl text-gray-500"
            style={{
              height: "calc(100vh - 78.233333px)",
              float: "left",
              overflow: "scroll",
            }}
          >
            <Suspense fallback="Loading...">
              <ul role="list" className="divide-y divide-gray-200">
                {drafts.map((message, index) => (
                  <>
                    <li
                      key={message.id + index}
                      className={`hidden sm:block relative bg-white py-5 px-4 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 ${
                        currentModule === message ? "bg-indigo-300" : "bg-white"
                      }`}
                      onClick={() => {
                        setModule(message)
                        Router.push("/drafts", { query: { suffix: message.suffix } })
                      }}
                    >
                      <div className="flex justify-between space-x-3">
                        <div className="min-w-0 flex-1">
                          <a href="#" className="block focus:outline-none">
                            <span className="absolute inset-0" aria-hidden="true" />
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {message.title}
                            </p>
                            <p className="text-sm text-gray-500 truncate">{message.description}</p>
                          </a>
                          <p>
                            <time
                              dateTime={message.updatedAt.toString()}
                              className="flex-shrink-0 whitespace-nowrap text-sm text-gray-500"
                            >
                              {moment(message.updatedAt).fromNow()}
                            </time>
                          </p>
                        </div>
                      </div>
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
                        className={`sm:hidden relative bg-white py-5 px-4 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 ${
                          currentModule === message ? "bg-indigo-300" : "bg-white"
                        }`}
                      >
                        <div className="flex justify-between space-x-3">
                          <div className="min-w-0 flex-1">
                            <a href="#" className="block focus:outline-none">
                              <span className="absolute inset-0" aria-hidden="true" />
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {message.title}
                              </p>
                              <p className="text-sm text-gray-500 truncate">
                                {message.description}
                              </p>
                              <p>
                                <time
                                  dateTime={message.updatedAt.toString()}
                                  className="flex-shrink-0 whitespace-nowrap text-sm text-gray-500"
                                >
                                  {moment(message.updatedAt).fromNow()}
                                </time>
                              </p>
                            </a>
                          </div>
                        </div>
                      </Disclosure.Button>
                    </span>
                  </>
                ))}
              </ul>
            </Suspense>
          </Disclosure.Panel>
          <Disclosure.Button className="hidden sm:inline inherit top-0 left-0 justify-between px-4 py-2 text-sm font-medium text-left text-purple-900 hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
            <ChevronRightIcon
              className={`${open ? "transform rotate-180" : ""} w-5 h-5 text-purple-500 `}
            />
          </Disclosure.Button>
          <div
            className={`${open ? "bg-gray-300 hidden" : "bg-gray-300"} float-right  sm:inline `}
            style={{
              top: 0,
              width: "100%",
              height: "calc(100vh - 78.233333px)",
              overflow: "scroll",
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
