import {
  Link,
  Routes,
  useMutation,
  useSession,
  useQuery,
  useRouter,
  usePaginatedQuery,
} from "blitz"
import Layout from "app/core/layouts/Layout"
import React, { Suspense } from "react"
import toast, { Toaster } from "react-hot-toast"
import { Disclosure } from "@headlessui/react"

import getDashboardData from "../core/queries/getDashboardData"
import { ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon } from "@heroicons/react/solid"
import Navbar from "../core/components/Navbar"
import Banner from "../core/components/Banner"
import OnboardingQuests from "../core/components/OnboardingQuests"
import followWorkspace from "../workspaces/mutations/followWorkspace"
import unfollowWorkspace from "../workspaces/mutations/unfollowWorkspace"
import getFeed from "../workspaces/queries/getFeed"

const ITEMS_PER_PAGE = 10

const DashboardContent = () => {
  const session = useSession()
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
      stat: "23",
    },
  ]

  if (data) {
    return (
      <>
        {data!.user!.emailIsVerified ? (
          ""
        ) : (
          <Banner message="You can only start publishing once your email is verified. Please check your inbox." />
        )}

        <div className="lg:flex w-screen">
          {/* Column 1 */}
          <div className="lg:w-1/4">
            <div className="my-2">
              <h1 className="text-4xl font-medium text-gray-900">
                Welcome back,{" "}
                {data.workspace!.name ? data.workspace!.name : "@" + data.workspace!.handle}
              </h1>
            </div>
            <h2 className="text-lg leading-6 font-medium text-gray-900">Your work</h2>
            <dl className="mt-5 rounded-lg bg-white overflow-hidden shadow divide-y divide-gray-200 md:grid-cols-3 md:divide-y-0 md:divide-x">
              {stats.map((item) => (
                <div key={item.name} className="px-4 py-5 sm:p-6">
                  <dt className="text-base font-normal text-gray-900">{item.name}</dt>
                  <dd className="mt-1 flex justify-between items-baseline md:block lg:flex">
                    <div className="flex items-baseline text-2xl font-semibold text-indigo-600">
                      {item.stat}
                    </div>
                  </dd>
                </div>
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
          <div className="lg:w-3/4 flex flex-col ">
            <div className="sm:flex w-full">
              <OnboardingQuests data={data} />
            </div>
            <h2 className="font-bold text-4xl">Feed</h2>

            {modules.length > 0 ? (
              <div>
                {modules.map((module) => (
                  <div key={module.suffix} className="bg-pink-300 mb-2">
                    <div>
                      <p>{module.type}</p>
                      <p>{module.title}</p>
                    </div>
                    <div className="flex">
                      <div className="flex-grow">
                        <p>
                          DOI:{" "}
                          <Link href={Routes.ModulePage({ suffix: module.suffix })}>
                            <a>10.53962/{module.suffix}</a>
                          </Link>
                        </p>
                        <p>Published: {module.publishedAt?.toISOString().substring(0, 10)}</p>
                      </div>
                      <div className="flex -space-x-2 relative z-0 overflow-hidden text-right">
                        {module.authors.map((author) => (
                          <img
                            key={author.id + author.moduleId}
                            // Had an issue here before, noting for future
                            src={author.workspace!.avatar!}
                            className="relative z-30 inline-block h-6 w-6 rounded-full "
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
                <div className="flex">
                  <div className="flex-1 flex items-center justify-between">
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{ITEMS_PER_PAGE * page + 1}</span> to{" "}
                      <span className="font-medium">
                        {ITEMS_PER_PAGE + page > count ? count : ITEMS_PER_PAGE + page}
                      </span>{" "}
                      of <span className="font-medium">{count}</span> results
                    </p>
                  </div>
                  <nav
                    className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                    aria-label="Pagination"
                  >
                    <button
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                      disabled={page === 0}
                      onClick={goToPreviousPage}
                    >
                      <span className="sr-only">Previous</span>
                      <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                    {Array.from({ length: Math.ceil(count / ITEMS_PER_PAGE) }, (x, i) => i).map(
                      (pageNr) => (
                        <button
                          key={`page-nav-feed-${pageNr}`}
                          className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                          disabled={page === pageNr}
                          onClick={() => {
                            goToPage(pageNr)
                          }}
                        >
                          <span className="sr-only">Navigate to page {pageNr}</span>
                          <span className="h-5 w-5 " aria-hidden="true">
                            {pageNr + 1}
                          </span>
                        </button>
                      )
                    )}
                    <button
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                      disabled={!hasMore}
                      onClick={goToNextPage}
                    >
                      <span className="sr-only">Previous</span>
                      <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </nav>
                </div>
              </div>
            ) : (
              <div className="flex flex-col flex-grow relative block w-full border-2 border-gray-300 border-dashed rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 h-96">
                <div className="table flex-grow w-full">
                  <div className="hidden sm:table-cell w-1/4"></div>
                  <span className="mx-auto table-cell align-middle leading-normal text-sm font-medium text-gray-900">
                    {data.followableWorkspaces.length > 0 ? (
                      <>
                        <div>Following people will help populate your feed</div>
                        <Disclosure>
                          {({ open }) => (
                            <>
                              <Disclosure.Button
                                as="p"
                                className=" px-4 py-2 text-sm font-medium text-purple-900 bg-purple-100 rounded-lg hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75"
                              >
                                <span className="font-bold">Find people to follow</span>
                              </Disclosure.Button>
                              <Disclosure.Panel className="px-4 pt-4 pb-2 text-left text-gray-500">
                                <WhoToFollow
                                  data={data}
                                  refetch={refetch}
                                  refetchFeed={refetchFeed}
                                />
                              </Disclosure.Panel>
                            </>
                          )}
                        </Disclosure>
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
      <Toaster />
      <Navbar />
      <main className="max-w-7xl lg:max-w-full mx-auto">
        <Suspense fallback="Loading...">
          <DashboardContent />
        </Suspense>
      </main>
    </>
  )
}

const WhoToFollow = ({ data, refetch, refetchFeed }) => {
  const [followWorkspaceMutation] = useMutation(followWorkspace)
  const [unfollowWorkspaceMutation] = useMutation(unfollowWorkspace)

  return (
    <>
      <h2 className="font-bold text-4xl">Who to follow</h2>
      {data.followableWorkspaces.map((workspace) => (
        <div key={workspace.id + workspace.handle} className="flex">
          <Link href={Routes.HandlePage({ handle: workspace.handle })}>
            <a className="flex-grow flex">
              <img className="w-10 h-10 rounded-full" src={workspace!.avatar!} />
              <p className="flex-grow">{workspace.handle}</p>
            </a>
          </Link>
          <button
            className="right-0"
            onClick={async () => {
              await followWorkspaceMutation({
                followerId: data.workspace?.id!,
                followedId: workspace.id,
              })

              toast((t) => (
                <span>
                  Custom and <b>bold</b>
                  <button
                    onClick={async () => {
                      await unfollowWorkspaceMutation({
                        followerId: data.workspace?.id!,
                        followedId: workspace.id,
                      })
                      refetch()
                      refetchFeed()
                      toast.dismiss(t.id)
                    }}
                  >
                    Undo
                  </button>
                </span>
              ))
              refetch()
              refetchFeed()
            }}
          >
            {data.workspace!.following.filter((x) => x.id === workspace.id).length > 0
              ? "Following"
              : "Follow"}
          </button>
        </div>
      ))}
    </>
  )
}

Dashboard.authenticate = true
Dashboard.suppressFirstRenderFlicker = true
Dashboard.getLayout = (page) => <Layout title="Dashboard">{page}</Layout>

export default Dashboard
