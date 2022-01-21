import {
  Link,
  useSession,
  useQuery,
  useRouter,
  useRouterQuery,
  useInfiniteQuery,
  Routes,
} from "blitz"
import Layout from "app/core/layouts/Layout"
import React, { useEffect } from "react"
import toast from "react-hot-toast"
import { ArrowUp32, ArrowDown32 } from "@carbon/icons-react"

import getDashboardData from "../core/queries/getDashboardData"
import Navbar from "../core/components/Navbar"
import OnboardingQuests from "../core/components/OnboardingQuests"
import getFeed from "../workspaces/queries/getFeed"
import generateSignature from "app/signature"
import WhoToFollow from "../core/components/WhoToFollow"
import LayoutLoader from "../core/components/LayoutLoader"
import getCurrentWorkspace from "app/workspaces/queries/getCurrentWorkspace"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import ModuleBoxFeed from "app/core/components/ModuleBoxFeed"

function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

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

const DashboardContent = ({
  expire,
  signature,
  query,
  ownWorkspace,
  router,
  data,
  refetch,
  refetchWorkspace,
}) => {
  const [modules, { isFetching, isFetchingNextPage, fetchNextPage, hasNextPage }] =
    useInfiniteQuery(getFeed, (page = { take: 20, skip: 0 }) => page, {
      getNextPageParam: (lastPage) => lastPage.nextPage,
    })

  const stats = [
    {
      name: "Drafts",
      stat: data.draftModules.length,
      change: data.draftPercentage,
      to: Routes.DraftsPage(),
    },
    {
      name: "Invitations",
      stat: data.invitedModules.length,
      change: data.invitedPercentage,
      to: Routes.InvitationsPage(),
    },
    {
      name: "Modules",
      stat: data.myPublishedModules.length,
      change: data.modulesPercentage,
      to: Routes.HandlePage({ handle: ownWorkspace.handle }),
    },
    {
      name: "Followers",
      stat: data.workspace.followers.length,
      to: "#",
    },
  ]

  useEffect(() => {
    if (query.authError) {
      toast.error("ORCID connection failed.")
    }
  }, [])

  if (data) {
    return (
      <>
        <div className="text-gray-900 dark:text-gray-200">
          {/* Column 1 */}
          <div className="p-4">
            <div className="my-0">
              <h1 className="text-4xl font-medium text-center">
                Welcome,{" "}
                {data.workspace.firstName && data.workspace.lastName
                  ? `${data.workspace.firstName} ${data.workspace.lastName}`
                  : `@${data.workspace!.handle}`}
                !
              </h1>
            </div>
            <div className="lg:flex w-full mt-4 gap-2">
              <OnboardingQuests
                data={data}
                expire={expire}
                signature={signature}
                refetch={refetchWorkspace}
              />
            </div>
            <dl className="mt-2 flex text-gray-900 dark:text-gray-200  overflow-hidden shadow dark:border rounded border-gray-100 dark:border-gray-600 divide-gray-100 dark:divide-gray-600 md:grid-cols-3 divide-x">
              {stats.map((item) => (
                <>
                  <Link href={item.to}>
                    <button
                      className="px-4 py-5 sm:p-6 flex-grow hover:bg-gray-50 dark:hover:bg-gray-800 text-left disabled:opacity-50"
                      disabled={item.stat === 0}
                    >
                      <dt className="text-base font-normal">{item.name}</dt>
                      <dd className="mt-1 flex justify-between items-baseline md:block lg:flex">
                        <div className="flex items-baseline text-2xl font-semibold text-indigo-600 dark:text-indigo-200">
                          {item.stat}
                          {item.change ? (
                            <p
                              className={classNames(
                                item.change === Infinity
                                  ? "hidden"
                                  : item.change > 0
                                  ? "text-green-700 dark:text-green-500"
                                  : "text-red-700 dark:text-red-500",
                                "ml-2 flex items-baseline text-sm font-semibold"
                              )}
                            >
                              {item.change > 0 ? (
                                <ArrowUp32
                                  className="self-center flex-shrink-0 h-5 w-5 text-green-500"
                                  aria-hidden="true"
                                />
                              ) : (
                                <ArrowDown32
                                  className="self-center flex-shrink-0 h-5 w-5 text-red-500"
                                  aria-hidden="true"
                                />
                              )}
                              <span className="sr-only">
                                {item.change > 0 ? "Increased" : "Decreased"} by
                              </span>
                              {item.change}%
                            </p>
                          ) : (
                            ""
                          )}
                        </div>
                      </dd>
                    </button>
                  </Link>
                </>
              ))}
            </dl>
          </div>
          {/* Column 2 */}
          <div className="flex w-full flex-col px-4">
            <div className="my-2">
              <ModuleBoxFeed
                modules={modules}
                fetchNextPage={fetchNextPage}
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
              />
            </div>
            {data.followableWorkspaces.length > 0 ? (
              <div className="mb-16">
                <WhoToFollow
                  data={data}
                  workspace={ownWorkspace}
                  refetch={refetch}
                  refetchFeed={refetchWorkspace}
                />
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </>
    )
  } else {
    return <></>
  }
}

const Dashboard = ({ expire, signature }) => {
  const currentUser = useCurrentUser()
  const session = useSession()
  const query = useRouterQuery()
  const [ownWorkspace, { refetch: refetchWorkspace }] = useQuery(getCurrentWorkspace, null)
  const router = useRouter()
  // TODO: Add user select
  const [data, { refetch }] = useQuery(getDashboardData, { session, changeDays: 7 })

  return (
    <>
      <Navbar
        currentUser={currentUser}
        session={session}
        currentWorkspace={ownWorkspace}
        router={router}
        drafts={data.draftModules}
        invitations={data.invitedModules}
        refetchFn={refetch}
      />
      <main className="max-w-7xl mx-auto">
        <DashboardContent
          expire={expire}
          signature={signature}
          query={query}
          ownWorkspace={ownWorkspace}
          router={router}
          data={data}
          refetch={refetch}
          refetchWorkspace={refetchWorkspace}
        />
      </main>
    </>
  )
}

Dashboard.authenticate = true
Dashboard.suppressFirstRenderFlicker = true
Dashboard.getLayout = (page) => (
  <Layout title="Dashboard">
    <LayoutLoader>{page}</LayoutLoader>
  </Layout>
)

export default Dashboard
