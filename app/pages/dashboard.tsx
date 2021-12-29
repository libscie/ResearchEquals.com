import {
  Link,
  Routes,
  useMutation,
  useSession,
  useQuery,
  useRouter,
  usePaginatedQuery,
  useRouterQuery,
} from "blitz"
import Layout from "app/core/layouts/Layout"
import React, { Suspense, useEffect } from "react"
import toast, { Toaster } from "react-hot-toast"
import { Disclosure } from "@headlessui/react"
import moment from "moment"

import getDashboardData from "../core/queries/getDashboardData"
import { ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon } from "@heroicons/react/solid"
import Navbar from "../core/components/Navbar"
import Banner from "../core/components/Banner"
import OnboardingQuests from "../core/components/OnboardingQuests"
import followWorkspace from "../workspaces/mutations/followWorkspace"
import unfollowWorkspace from "../workspaces/mutations/unfollowWorkspace"
import getFeed from "../workspaces/queries/getFeed"
import ModuleCard from "../core/components/ModuleCard"
import FollowButton from "app/workspaces/components/FollowButton"
import FeedPagination from "../core/components/FeedPagination"

const ITEMS_PER_PAGE = 10

const DashboardContent = () => {
  const session = useSession()
  const query = useRouterQuery()
  // const [updateInvitationMutation, { isSuccess: invitationUpdated }] = useMutation(updateInvitation)
  const [followWorkspaceMutation] = useMutation(followWorkspace)
  const [unfollowWorkspaceMutation] = useMutation(unfollowWorkspace)
  const [data, { refetch }] = useQuery(getDashboardData, { session })
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const [{ modules, hasMore, count }, { refetch: refetchFeed }] = usePaginatedQuery(getFeed, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })
  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToPage = (number) => router.push({ query: { page: number } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  const stats = [
    {
      name: "Drafts",
      stat: data.draftModules.length,
    },
    {
      name: "Invitations",
      stat: data.invitedModules.length,
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
        <div className="lg:flex flex-row text-gray-900 dark:text-gray-200">
          {/* Column 1 */}
          <div className="lg:w-1/4 p-4">
            <div className="my-0">
              <h1 className="text-4xl font-medium">
                Welcome back,{" "}
                {data.workspace!.name ? data.workspace!.name : "@" + data.workspace!.handle}!
              </h1>
            </div>
            <dl className="mt-2 flex text-gray-900 dark:text-gray-200  overflow-hidden shadow dark:border rounded border-gray-100 dark:border-gray-600 divide-gray-100 dark:divide-gray-600 md:grid-cols-3 divide-x">
              {stats.map((item) => (
                <>
                  <Link href={`/${item.name.toLowerCase()}`}>
                    <button
                      className="px-4 py-5 sm:p-6 flex-grow hover:bg-gray-50 dark:hover:bg-gray-800 text-left"
                      disabled={item.stat === 0}
                    >
                      <dt className="text-base font-normal">{item.name}</dt>
                      <dd className="mt-1 flex justify-between items-baseline md:block lg:flex">
                        <div className="flex items-baseline text-2xl font-semibold text-indigo-600 dark:text-indigo-200">
                          {item.stat}
                        </div>
                      </dd>
                    </button>
                  </Link>
                </>
              ))}
            </dl>
            {data.followableWorkspaces.length > 0 ? (
              <div className="hidden lg:inline">
                <WhoToFollow data={data} refetch={refetch} refetchFeed={refetchFeed} />
              </div>
            ) : (
              ""
            )}
          </div>
          {/* Column 2 */}
          <div className="flex w-full flex-col px-4">
            <div className="lg:flex w-full mt-4">
              <OnboardingQuests data={data} />
            </div>
            <div className="my-2">
              {modules.length > 0 ? (
                <>
                  <div className="rounded-t-md border border-gray-300 dark:border-gray-600 mt-8 divide-y divide-gray-300 dark:divide-gray-600">
                    <h1 className="text-xs leading-4 font-medium mx-4 my-2 text-gray-500 dark:text-gray-400 ">
                      Published modules
                    </h1>
                    <ul role="list" className="divide-y divide-gray-300 dark:divide-gray-600">
                      {modules.map((module) => (
                        <>
                          <li
                            onClick={() => {
                              router.push(`/modules/${module.suffix}`)
                            }}
                            className="cursor-pointer"
                          >
                            <ModuleCard
                              type={module.type.name}
                              title={module.title}
                              status={`DOI: 10.53962/${module.suffix}`}
                              time={moment(module.publishedAt).fromNow()}
                              timeText="Published"
                              authors={module.authors}
                            />
                          </li>
                        </>
                      ))}
                    </ul>
                  </div>
                  <FeedPagination
                    ITEMS_PER_PAGE={ITEMS_PER_PAGE}
                    page={page}
                    count={count}
                    goToPreviousPage={goToPreviousPage}
                    goToPage={goToPage}
                    goToNextPage={goToNextPage}
                    hasMore={hasMore}
                  />
                </>
              ) : (
                <div className="flex flex-col flex-grow relative w-full border-2 border-gray-1000 border-dashed rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500  my-4 h-auto">
                  <div className="table flex-grow w-full">
                    <div className="sm:table-cell w-1/4 h-28"></div>
                    <span className="mx-auto table-cell align-middle leading-normal text-sm leading-4 font-medium">
                      {data.followableWorkspaces.length > 0 ? (
                        <>
                          <div>Following people will help fill your feed</div>
                        </>
                      ) : (
                        <></>
                      )}
                    </span>
                    <div className="hidden sm:table-cell w-1/4"></div>
                  </div>
                </div>
              )}
            </div>
            {data.followableWorkspaces.length > 0 ? (
              <div className="inline lg:hidden mb-16">
                <WhoToFollow data={data} refetch={refetch} refetchFeed={refetchFeed} />
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

const Dashboard = () => {
  return (
    <>
      <Navbar />
      <main className="max-w-7xl lg:max-w-full mx-auto max-h-full h-full">
        <Suspense fallback="Loading...">
          <DashboardContent />
        </Suspense>
      </main>
    </>
  )
}

const WhoToFollow = ({ data, refetch, refetchFeed }) => {
  const refetchFn = () => {
    refetch()
    refetchFeed()
  }

  return (
    <>
      <h2 className="text-2xl font-medium my-2">Who to follow</h2>
      {data.followableWorkspaces.map((author) => (
        <>
          <li className="py-2 flex">
            <div className="mr-2">
              <img
                src={author.avatar}
                alt={`Avatar of ${author.name}`}
                className="w-10 h-10 rounded-full inline-block h-full align-middle"
              />
            </div>
            <Link href={Routes.HandlePage({ handle: author.handle })}>
              <a className="flex-grow">
                <span className="inline-block h-full align-middle"></span>
                <p className="text-gray-700 dark:text-gray-200 text-sm leading-4 font-normal my-auto inline-block align-middle">
                  {author.name}
                  <p className="text-gray-500 dark:text-gray-400 text-xs leading-4 font-normal">
                    @{author.handle}
                  </p>
                </p>
              </a>
            </Link>
            <FollowButton author={author} refetchFn={refetchFn} />
          </li>
        </>
      ))}
    </>
  )
}

Dashboard.authenticate = true
Dashboard.suppressFirstRenderFlicker = true
Dashboard.getLayout = (page) => <Layout title="Dashboard">{page}</Layout>

export default Dashboard
