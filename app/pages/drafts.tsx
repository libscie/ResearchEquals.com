import { BlitzPage, useSession, useQuery } from "blitz"
import Layout from "app/core/layouts/Layout"
import { Disclosure } from "@headlessui/react"
import { ChevronUpIcon } from "@heroicons/react/solid"
import { Suspense, useState } from "react"
import { ProgressBarRound32 } from "@carbon/icons-react"

import Navbar from "../core/components/Navbar"
import getDrafts from "../core/queries/getDrafts"
import ModuleEdit from "../modules/components/ModuleEdit"
import { useCurrentUser } from "../core/hooks/useCurrentUser"

const DraftsContents = () => {
  const session = useSession()
  const [currentModule, setModule] = useState<any>(undefined)
  const [drafts] = useQuery(getDrafts, { session })
  const user = useCurrentUser()

  return (
    <Disclosure defaultOpen={true}>
      {({ open }) => (
        <>
          <Disclosure.Button className="hidden sm:inline inherit top-0 left-0 justify-between px-4 py-2 text-sm font-medium text-left text-purple-900 bg-purple-100 rounded-lg hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
            <ChevronUpIcon
              className={`${open ? "transform rotate-180" : ""} w-5 h-5 text-purple-500 `}
            />
          </Disclosure.Button>
          <Disclosure.Panel
            className="float-left w-full sm:w-64 bg-red-100 px-4 pt-4 pb-2 text-2xl text-gray-500"
            style={{
              height: "calc(100vh - 78.233333px)",
              float: "left",
              overflow: "scroll",
            }}
          >
            <Suspense fallback="Loading...">
              {drafts.map((draft, index) => {
                return (
                  <>
                    <Disclosure.Button
                      as="div"
                      key={draft.suffix + "-disclosure" + index}
                      className={`inline sm:hidden ${
                        currentModule === draft ? "bg-indigo-600" : "bg-pink-300"
                      } max-w-screen mt-2`}
                    >
                      <button
                        onClick={() => {
                          setModule(draft)
                        }}
                        className={`inline sm:hidden ${
                          currentModule === draft ? "bg-indigo-600" : "bg-pink-300"
                        } max-w-screen mt-2`}
                      >
                        <h2 className="truncate text-black text-left">{draft.title}</h2>
                        <p className="truncate text-xs  text-left">{draft.description}</p>
                      </button>
                    </Disclosure.Button>
                    <button
                      key={draft.suffix + "-button" + index}
                      className={`hidden sm:inline ${
                        currentModule === draft ? "bg-indigo-600" : "bg-pink-300"
                      } max-w-10 mt-2`}
                      onClick={() => {
                        setModule(draft)
                      }}
                    >
                      <h2 className="truncate text-black text-left">{draft.title}</h2>
                      <p className="truncate text-xs text-left">{draft.description}</p>
                    </button>
                  </>
                )
              })}
            </Suspense>
          </Disclosure.Panel>
          <div
            className={`${open ? "bg-indigo-300 hidden" : "bg-pink-300"} float-right  sm:inline `}
            style={{
              top: 0,
              width: "100%",
              height: "calc(100vh - 78.233333px)",
              overflow: "scroll",
            }}
          >
            <div className="max-w-5xl my-16 sm:my-6 bg-red-100 mx-auto text-xl">
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
