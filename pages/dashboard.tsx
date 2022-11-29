import { gSSP } from "app/blitz-server"
import Link from "next/link"
import { Routes } from "@blitzjs/next"
import { useRouter } from "next/router"
import { useQuery, useInfiniteQuery } from "@blitzjs/rpc"
import { useSession } from "@blitzjs/auth"
import Layout from "app/core/layouts/Layout"
import React, { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { ArrowUp, ArrowDown } from "@carbon/icons-react"

import getDashboardData from "app/core/queries/getDashboardData"
import Navbar from "app/core/components/Navbar"
import OnboardingQuests from "app/core/components/OnboardingQuests"
import getFeed from "app/workspaces/queries/getFeed"
import generateSignature from "app/signature"
import WhoToFollow from "app/core/components/WhoToFollow"
import LayoutLoader from "app/core/components/LayoutLoader"
import getCurrentWorkspace from "app/workspaces/queries/getCurrentWorkspace"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import ModuleBoxFeed from "app/core/components/ModuleBoxFeed"
import ViewFollowers from "app/modules/components/ViewFollowers"

function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

export const getServerSideProps = gSSP(async function getServerSideProps(context) {
  // Expires in 30 minutes
  const expire = Math.round(Date.now() / 1000) + 60 * 30
  const signature = generateSignature(process.env.UPLOADCARE_SECRET_KEY, expire.toString())

  return {
    props: {
      expire,
      signature,
    },
  }
})

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
  const [viewFollowers, setViewFollowers] = useState(false)

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
      name: "My Modules",
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

  const refetchAll = () => {
    refetch()
    refetchWorkspace()
  }

  if (data) {
    return (
      <>
        <div className="text-gray-900 dark:text-gray-200">
          {/* Column 1 */}
          <div className="p-4">
            <div className="my-0">
              <h1 className="text-center text-4xl font-medium">
                Welcome,{" "}
                {data.workspace.firstName && data.workspace.lastName
                  ? `${data.workspace.firstName} ${data.workspace.lastName}`
                  : `@${data.workspace!.handle}`}
                !
              </h1>
            </div>
            <div className="mt-4 w-full gap-2 lg:flex">
              <OnboardingQuests
                data={data}
                expire={expire}
                signature={signature}
                refetch={refetchAll}
              />
            </div>
            <dl className="mt-2 flex divide-x divide-gray-100  overflow-hidden rounded border-gray-100 text-gray-900 shadow dark:divide-gray-600 dark:border dark:border-gray-600 dark:text-gray-200 md:grid-cols-3">
              {stats.map((item) => {
                if (item.name === "Followers") {
                  return (
                    <>
                      <button
                        className="flex-grow px-4 py-5 text-left hover:bg-gray-50 disabled:opacity-50 dark:hover:bg-gray-800 sm:p-6"
                        disabled={item.stat === 0}
                        onClick={() => {
                          setViewFollowers(true)
                        }}
                      >
                        <dt className="text-base font-normal">{item.name}</dt>
                        <dd className="mt-1 flex items-baseline justify-between md:block lg:flex">
                          <div className="flex items-baseline text-2xl font-semibold text-indigo-600 dark:text-indigo-200">
                            {item.stat}
                            {item.change ? (
                              <p
                                className={classNames(
                                  item.change === Infinity
                                    ? "hidden"
                                    : item.change > 0
                                    ? "text-emerald-700 dark:text-emerald-500"
                                    : "text-red-700 dark:text-red-500",
                                  "ml-2 flex items-baseline text-sm font-semibold"
                                )}
                              >
                                {item.change > 0 ? (
                                  <ArrowUp
                                    size={32}
                                    className="h-5 w-5 shrink-0 self-center text-emerald-500"
                                    aria-hidden="true"
                                  />
                                ) : (
                                  <ArrowDown
                                    size={32}
                                    className="h-5 w-5 shrink-0 self-center text-red-500"
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
                    </>
                  )
                } else {
                  return (
                    <>
                      <Link href={item.to}>
                        <button
                          className="flex-grow px-4 py-5 text-left hover:bg-gray-50 disabled:opacity-50 dark:hover:bg-gray-800 sm:p-6"
                          disabled={item.stat === 0}
                        >
                          <dt className="text-base font-normal">{item.name}</dt>
                          <dd className="mt-1 flex items-baseline justify-between md:block lg:flex">
                            <div className="flex items-baseline text-2xl font-semibold text-indigo-600 dark:text-indigo-200">
                              {item.stat}
                              {item.change ? (
                                <p
                                  className={classNames(
                                    item.change === Infinity
                                      ? "hidden"
                                      : item.change > 0
                                      ? "text-emerald-700 dark:text-emerald-500"
                                      : "text-red-700 dark:text-red-500",
                                    "ml-2 flex items-baseline text-sm font-semibold"
                                  )}
                                >
                                  {item.change > 0 ? (
                                    <ArrowUp
                                      size={32}
                                      className="h-5 w-5 shrink-0 self-center text-emerald-500"
                                      aria-hidden="true"
                                    />
                                  ) : (
                                    <ArrowDown
                                      size={32}
                                      className="h-5 w-5 shrink-0 self-center text-red-500"
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
                  )
                }
              })}
            </dl>
          </div>
          <ViewFollowers
            viewAuthorsOpen={viewFollowers}
            setViewAuthorsOpen={setViewFollowers}
            followers={data.workspace.followers}
            ownWorkspace={ownWorkspace}
            refetch={refetchWorkspace}
          />
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
  const query = useRouter().query
  const [ownWorkspace, { refetch: refetchWorkspace }] = useQuery(getCurrentWorkspace, null)
  const router = useRouter()
  // TODO: Add user select
  const [data, { refetch }] = useQuery(getDashboardData, {
    session: session.userId ? session : { ...session, userId: undefined },
    changeDays: 7,
  })

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
      <main className="mx-auto w-full max-w-7xl">
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
