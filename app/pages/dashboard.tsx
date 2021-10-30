import {
  getSession,
  Link,
  Routes,
  useMutation,
  useSession,
  useQuery,
  useRouter,
  usePaginatedQuery,
} from "blitz"
import Layout from "app/core/layouts/Layout"
import moment from "moment"
import React, { Suspense, Fragment } from "react"
import { CheckmarkOutline32 } from "@carbon/icons-react"
import { Popover, Transition } from "@headlessui/react"
import getDashboardData from "../core/queries/getDashboardData"
import { InformationCircleIcon, ArrowSmDownIcon, ArrowSmUpIcon } from "@heroicons/react/solid"
import Navbar from "../core/components/Navbar"
import updateInvitation from "../authorship/mutations/updateInvitation"
import Banner from "../core/components/Banner"
import OnboardingQuests from "../core/components/OnboardingQuests"
import followWorkspace from "../workspaces/mutations/followWorkspace"
import unfollowWorkspace from "../workspaces/mutations/unfollowWorkspace"
import getFeed from "../workspaces/queries/getFeed"

function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

const solutions = [
  {
    name: "Insights",
    description: "Measure actions your users take",
    href: "##",
  },
  {
    name: "Automations",
    description: "Create your own targeted content",
    href: "##",
  },
  {
    name: "Reports",
    description: "Keep track of your growth",
    href: "##",
  },
]

const ITEMS_PER_PAGE = 1

const DashboardContent = () => {
  const session = useSession()
  // const [updateInvitationMutation, { isSuccess: invitationUpdated }] = useMutation(updateInvitation)
  const [followWorkspaceMutation] = useMutation(followWorkspace)
  const [unfollowWorkspaceMutation] = useMutation(unfollowWorkspace)
  const [data, { refetch }] = useQuery(getDashboardData, { session })
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const [{ modules, hasMore }] = usePaginatedQuery(getFeed, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })
  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
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
            {data.workspaces ? (
              <div className="hidden lg:inline">
                <h2 className="font-bold text-4xl">Who to follow</h2>
                {data.followableWorkspaces.map((workspace) => (
                  <div key={workspace.id + workspace.handle} className="flex w-full">
                    <Link href={Routes.HandlePage({ handle: workspace.handle })}>
                      <a className="flex-grow flex">
                        <img className="w-10 h-10 rounded-full" src={workspace!.avatar!} />
                        <p className="flex-grow">{workspace.handle}</p>
                      </a>
                    </Link>
                    <button
                      className="right-0"
                      onClick={async () => {
                        if (
                          data.workspace!.following.filter((x) => x.id === workspace.id).length > 0
                        ) {
                          await unfollowWorkspaceMutation({
                            followerId: data.workspace?.id!,
                            followedId: workspace.id,
                          })
                        } else {
                          // TODO: Add follow action
                          await followWorkspaceMutation({
                            followerId: data.workspace?.id!,
                            followedId: workspace.id,
                          })
                        }
                        refetch()
                        // TODO: Maybe refetch upon completion?
                      }}
                    >
                      {data.workspace!.following.filter((x) => x.id === workspace.id).length > 0
                        ? "Following"
                        : "Follow"}
                      {/* TODO: Make dynamic depending on whether person is being followed or not */}
                    </button>
                  </div>
                ))}
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
            <div>
              {modules.map((project) => (
                <p key={project.id}>
                  {/* <Link href={Routes.Project({ handle: project.handle })}> */}
                  <a>{project.title}</a>
                  {/* </Link> */}
                </p>
              ))}
              <button disabled={page === 0} onClick={goToPreviousPage}>
                Previous
              </button>
              <button disabled={!hasMore} onClick={goToNextPage}>
                Next
              </button>
            </div>
            {data!.modules.length > 0 ? (
              <>
                {data!.modules.map((module) => {
                  return (
                    <div key={module.suffix} className="bg-pink-300 mb-2">
                      {/* {JSON.stringify(module)} */}
                      <div>
                        <p>{module.type}</p>
                        <p>{module.title}</p>
                      </div>
                      <div className="flex">
                        <div className="flex-grow">
                          <p>DOI: 10.53962/{module.suffix}</p>
                          <p>Published: {module.publishedAt?.toISOString().substring(0, 10)}</p>
                        </div>
                        <div className="flex -space-x-2 relative z-0 overflow-hidden text-right">
                          {module.authors.map((author) => (
                            <img
                              key={author.id + author.moduleId}
                              src={author.workspace!.avatar!}
                              className="relative z-30 inline-block h-6 w-6 rounded-full "
                            />
                          ))}
                        </div>
                      </div>
                      {/* <p>
                        <Link href={Routes.ModulePage({ suffix: module.suffix })}>
                          <a>
                            {moment(module.publishedAt).fromNow()} 10.53962/{module.suffix}{" "}
                            {module.title}
                          </a>
                        </Link>
                      </p> */}
                    </div>
                  )
                })}
              </>
            ) : (
              <div className="flex flex-col flex-grow relative block w-full border-2 border-gray-300 border-dashed rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 h-96">
                <div className="table flex-grow w-full">
                  <span className="mx-auto table-cell align-middle leading-normal text-sm font-medium text-gray-900">
                    <div>Following people will help populate your feed</div>
                    <button className="font-bold">Find people to follow</button>
                  </span>
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
      <Navbar />
      <main className="max-w-7xl lg:max-w-full mx-auto">
        <Suspense fallback="Loading...">
          <DashboardContent />
        </Suspense>
      </main>
    </>
  )
}

Dashboard.authenticate = true
Dashboard.suppressFirstRenderFlicker = true
Dashboard.getLayout = (page) => <Layout title="Dashboard">{page}</Layout>

export default Dashboard
